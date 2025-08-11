from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, GameParticipant,Comment,PlayByPlay
from fastapi import HTTPException
from backend.schemas.film_room import *
from backend.utils.stat_calculations import *


#helper functions

def calculate_total_points(box_scores):
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)


def calculate_total_possessions(box_scores):
    total_poss = 0
    for box_score in box_scores:
        fga = calculate_fga(box_score.twopa, box_score.threepa)
        total_poss += calculate_possessions(fga, box_score.fta, box_score.oreb, box_score.tov)
    return total_poss


def get_game_result_and_scores(box_scores):
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])
    result = game_result(team_pts, opp_pts)
    return team_pts, opp_pts, result


def get_game_box_scores(game_id: UUID, db: Session):
    return db.execute(select(BoxScore).where(BoxScore.game_id == game_id)).scalars().all()


def try_commit_db(db: Session, model_instance):
    try:
        db.commit()
        db.refresh(model_instance)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


def not_found_error():
    return HTTPException(status_code=404, detail="Not found")


def create_model(db: Session, model_class, create_schema):
    model_instance = model_class(**create_schema.model_dump())
    db.add(model_instance)
    return model_instance


def update_fields(model, update_obj):
    for field, value in update_obj.model_dump(exclude_unset=True).items():
        setattr(model, field, value)


def calculate_basic_box_score(box_score):
    points = calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm)
    rebounds = calculate_rebounds(box_score.oreb, box_score.dreb)
    efficiency = calculate_efficiency(points, rebounds, box_score.ast, box_score.stl,
                                      box_score.blk, box_score.twopa + box_score.threepa,
                                      box_score.twopm + box_score.threepm, box_score.dreb + box_score.fta,
                                      box_score.oreb + box_score.ftm, box_score.dreb + box_score.tov)
    return ({
        "mins": box_score.mins,
        "pts": points,
        "ast": box_score.ast,
        "reb": rebounds,
        "oreb": box_score.oreb,
        "dreb": box_score.dreb,
        "stl": box_score.stl,
        "blk": box_score.blk,
        "tov": box_score.tov,
        "fls": box_score.fls,
        "eff": efficiency,
        "plus_minus": box_score.plus_minus
    })


def calculate_shooting_box_score(box_score):
    points = calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm)
    fgm = calculate_fgm(box_score.twopm, box_score.threepm)
    fga = calculate_fga(box_score.twopa, box_score.threepa)
    fg_pct = calculate_fg_percent(fgm, fga)
    threep_pct = calculate_3p_percent(box_score.threepm, box_score.threepa)
    ft_pct = calculate_ft_percent(box_score.ftm, box_score.fta)
    efg_pct = calculate_efg_percent(fgm, box_score.threepm, fga)
    ts_pct = calculate_ts_percent(points, fga, box_score.fta)

    return ({
        "fgm": fgm,
        "fga": fga,
        "fg_pct": fg_pct,
        "threepm": box_score.threepm,
        "threepa": box_score.threepa,
        "threep_pct": threep_pct,
        "ftm": box_score.ftm,
        "fta": box_score.fta,
        "ft_pct": ft_pct,
        "efg_pct": efg_pct,
        "ts_pct": ts_pct
    })


#Game Services

def create_game(db: Session, new_game=CreateGame):
    game = create_model(db, Game, new_game)
    try_commit_db(db, game)

    return game


def get_all_team_games(db: Session, team_id: UUID):
    games = db.execute(
        select(Game)
        .where(Game.team_id == team_id)
        .order_by(Game.date.desc())
    ).scalars().all()

    all_games = []

    for game in games:
        box_scores = get_game_box_scores(game.id, db)
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        all_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    return all_games


def get_game_details(db: Session, game_id: UUID):
    game = db.execute(
        select(Game)
        .where(Game.id == game_id)
    ).scalar_one_or_none()

    if not game:
        return not_found_error()

    return game


def update_game_details(db: Session, update_game: UpdateGame,game_id:UUID):
    game = db.execute(
        select(Game).where(Game.id == game_id)
    ).scalar_one_or_none()

    if not game:
        raise not_found_error()

    update_fields(game, update_game)
    try_commit_db(db, game)

    return game


def delete_game(db: Session, game_id: UUID):
    game = db.execute(
        select(Game).where(Game.id == game_id)
    ).scalar_one_or_none()

    if not game:
        raise not_found_error()

    db.delete(game)
    try_commit_db(db, game)

    return "game deleted"


#Game Participant Services
def create_game_participant(db: Session, participant: CreateGameParticipant):
    participant = create_model(db, GameParticipant, participant)
    try_commit_db(db, participant)

    return participant


def get_game_participants(db: Session, game_id: UUID):
    participants = db.execute(
        select(GameParticipant)
        .where(GameParticipant.game_id == game_id)
    ).scalars().all()

    if not participants:
        raise not_found_error()

    return participants


def delete_participant(db: Session, game_id:UUID,user_id:UUID):
    participant = db.execute(
        select(GameParticipant).where(
            GameParticipant.game_id == game_id,
            GameParticipant.user_id == user_id)
    ).scalar_one_or_none()

    if not participant:
        raise not_found_error()

    db.delete(participant)
    try_commit_db(db, participant)

    return "participant deleted"


#Box Score Services
def create_box_scores(db: Session, box_scores: List[CreateBoxScore]):
    box_score = []
    for bs in box_scores:
        create_model(db, BoxScore, bs)
        box_score.append(bs)

    try_commit_db(db, box_score)

    return box_score


def get_basic_box_scores(db: Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == True)
    ).scalars().all()

    team_scores = [
        ReadBasicBoxScore(
            user_id=bs.user_id,
            name=bs.user.name if bs.user else "",
            **calculate_basic_box_score(bs)
        )
        for bs in team_box_scores
    ]

    opponent_scores = [
        ReadBasicBoxScore(
            user_id=None,
            name="opponent",
            **calculate_basic_box_score(bs)
        )
        for bs in opponent_box_scores
    ]

    return {
        "team": team_scores,
        "opponent": opponent_scores
    }


def get_shooting_box_scores(db: Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == True)
    ).scalars().all()

    team_scores = [
        ReadShootingBoxScore(
            user_id=bs.user_id,
            name=bs.user.name if bs.user else "",
            **calculate_shooting_box_score(bs)
        )
        for bs in team_box_scores
    ]

    opponent_scores = [
        ReadShootingBoxScore(
            user_id=None,
            name="opponent",
            **calculate_shooting_box_score(bs)
        )
        for bs in opponent_box_scores
    ]

    return {
        "team": team_scores,
        "opponent": opponent_scores
    }


def get_team_advanced_stats(db: Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == True)
    ).scalars().all()

    team_pts = calculate_total_points(team_box_scores)
    opp_pts = calculate_total_points(opponent_box_scores)
    team_poss = calculate_total_possessions(team_box_scores)
    opp_poss = calculate_total_possessions(opponent_box_scores)
    total_mins = sum(tbs.mins for tbs in team_box_scores) / 5

    off_rtg = calculate_off_rtg(team_pts, team_poss)
    def_rtg = calculate_def_rtg(opp_pts, opp_poss)
    net_rtg = calculate_net_rtg(off_rtg, def_rtg)
    pace = calculate_pace(team_poss, opp_poss, total_mins)

    return ({
        "off_rtg": off_rtg,
        "def_rtg": def_rtg,
        "net_rtg": net_rtg,
        "pace": pace
    })

def update_box_score(db: Session, box_scores: List[UpdateBoxScore]):
    updated_bs = []
    for bs_update in box_scores:
        box_score = db.execute(
            select(BoxScore).where(BoxScore.id == bs_update.id)
        ).scalar_one_or_none()

        if not box_score:
            raise not_found_error()

        update_fields(box_score, bs_update)
        updated_bs.append(box_score)

    try_commit_db(db,updated_bs)

    return updated_bs

#comment
def create_comment(db:Session, comments:List[CreateComment]):
    created_comments =[]
    for comment in comments:
        new_comment = create_model(db,Comment,comment)
        created_comments.append(new_comment)

    try_commit_db(db,created_comments)

    return created_comments

def get_comments(db:Session, game_id: UUID):
    comments = db.execute(
        select(Comment)
        .where(Comment.game_id == game_id)
    ).scalars().all()

    if not comments:
        raise not_found_error()

    return comments

def update_comment(db:Session, update_comment:UpdateComment):
    comment = db.execute(
        select(Comment).where(Comment.id == update_comment.id)
    ).scalar_one_or_none()

    if not comment:
        raise not_found_error()

    update_fields(comment, update_comment)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return comment

def delete_comment(db:Session, comment_id:UUID):
    comment = db.execute(
        select(Comment).where(Comment.id == comment_id)
    ).scalar_one_or_none()

    if not comment:
        raise not_found_error()

    db.delete(comment)
    try_commit_db(db,comment)

    return "comment deleted"

#play by play

def create_play_by_plays(db:Session,play_by_plays:List[CreatePlayByPlay]):
    created_play_by_plays = []
    for play_by_play in play_by_plays:
        pbp = create_model(db,PlayByPlay,play_by_play)
        created_play_by_plays.append(pbp)

    try_commit_db(db,created_play_by_plays)
    return created_play_by_plays

def get_play_by_plays(db:Session, game_id: UUID):
    play_by_plays = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.game_id == game_id)
        .order_by(PlayByPlay.timestamp_seconds.desc())
    ).scalars().all()

    return play_by_plays if play_by_plays else []

def delete_play_by_play(db:Session, play_by_play_id):
    play_by_play = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.id == play_by_play_id)
    ).scalar_one_or_none()

    if not play_by_play:
        raise not_found_error()

    db.delete(play_by_play)
    try_commit_db(db,play_by_play)

    return "play_by_play deleted"