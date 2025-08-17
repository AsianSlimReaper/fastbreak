from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, GameParticipant,Comment,PlayByPlay, Substitution, TeamMembership, User
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
    # Remove 'participants' from the dict before creating the Game model
    game_data = new_game.model_dump(exclude={"participants"})
    participants = new_game.participants if hasattr(new_game, "participants") else []
    game = Game(**game_data)
    db.add(game)
    try_commit_db(db, game)

    # Add participants if provided, only if not already present
    participant_objs = []
    if participants:
        for user_id in participants:
            exists = db.execute(
                select(GameParticipant).where(
                    GameParticipant.game_id == game.id,
                    GameParticipant.user_id == user_id
                )
            ).scalar_one_or_none()
            if not exists:
                participant_obj = GameParticipant(game_id=game.id, user_id=user_id)
                db.add(participant_obj)
                participant_objs.append(participant_obj)
        db.commit()
        for obj in participant_objs:
            db.refresh(obj)

    # Create box scores for all participants (team) if not already present
    for user_id in participants:
        exists = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id,
                BoxScore.user_id == user_id,
                BoxScore.is_opponent == False
            )
        ).scalar_one_or_none()
        if not exists:
            box_score = BoxScore(
                game_id=game.id,
                user_id=user_id,
                team_id=new_game.team_id,
                is_opponent=False,
                mins=0,
                ast=0,
                oreb=0,
                dreb=0,
                stl=0,
                blk=0,
                tov=0,
                fls=0,
                plus_minus=0,
                twopm=0,
                twopa=0,
                threepm=0,
                threepa=0,
                ftm=0,
                fta=0,
            )
            db.add(box_score)

    # Automatically create an opponent box score row for this game if not already present
    exists_opp = db.execute(
        select(BoxScore).where(
            BoxScore.game_id == game.id,
            BoxScore.is_opponent == True
        )
    ).scalar_one_or_none()
    if not exists_opp:
        opponent_box = BoxScore(
            game_id=game.id,
            is_opponent=True,
            user_id=None,
            mins=0,
            ast=0,
            oreb=0,
            dreb=0,
            stl=0,
            blk=0,
            tov=0,
            fls=0,
            plus_minus=0,
            twopm=0,
            twopa=0,
            threepm=0,
            threepa=0,
            ftm=0,
            fta=0,
        )
        db.add(opponent_box)
    db.commit()

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
            "game_id":game.id,
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
    # Only add if not already present
    exists = db.execute(
        select(GameParticipant).where(
            GameParticipant.game_id == participant.game_id,
            GameParticipant.user_id == participant.user_id
        )
    ).scalar_one_or_none()
    if exists:
        return exists
    participant_obj = create_model(db, GameParticipant, participant)
    try_commit_db(db, participant_obj)

    return participant_obj

def create_game_participants_bulk(db: Session, participants: list[CreateGameParticipant]):
    created = []
    for participant in participants:
        obj = create_model(db, GameParticipant, participant)
        db.add(obj)
        created.append(obj)
    try:
        db.commit()
        for obj in created:
            db.refresh(obj)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    return created


def get_game_participants(db: Session, game_id: UUID):
    participants = db.execute(
        select(GameParticipant)
        .where(GameParticipant.game_id == game_id)
    ).scalars().all()
    # Return ORM objects directly for FastAPI to serialize using the schema
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
    objs = [create_model(db, BoxScore, bs) for bs in box_scores]
    db.add_all(objs)
    db.commit()
    for obj in objs:
        db.refresh(obj)
    return objs


def get_basic_box_scores(db: Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == True)
    ).scalars().all()

    # Get all participants for the game
    participants = db.execute(
        select(GameParticipant)
        .where(GameParticipant.game_id == game_id)
    ).scalars().all()

    # Map user_id to box score for quick lookup
    box_score_map = {str(bs.user_id): bs for bs in team_box_scores if bs.user_id}

    team_scores = []
    for participant in participants:
        user_id = participant.user_id
        bs = box_score_map.get(str(user_id))
        if bs:
            team_scores.append(
                ReadBasicBoxScore(
                    user_id=bs.user_id,
                    name=bs.user.name if bs.user else "",
                    **calculate_basic_box_score(bs)
                )
            )
        else:
            # Default all stats to 0 if no box score exists
            team_scores.append(
                ReadBasicBoxScore(
                    user_id=user_id,
                    name=participant.user.name if participant.user else "",
                    mins=0,
                    pts=0,
                    ast=0,
                    reb=0,
                    oreb=0,
                    dreb=0,
                    stl=0,
                    blk=0,
                    tov=0,
                    fls=0,
                    eff=0,
                    plus_minus=0
                )
            )

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

    # Get all participants for the game
    participants = db.execute(
        select(GameParticipant)
        .where(GameParticipant.game_id == game_id)
    ).scalars().all()

    # Map user_id to box score for quick lookup
    box_score_map = {str(bs.user_id): bs for bs in team_box_scores if bs.user_id}

    team_scores = []
    for participant in participants:
        user_id = participant.user_id
        bs = box_score_map.get(str(user_id))
        if bs:
            team_scores.append(
                ReadShootingBoxScore(
                    user_id=bs.user_id,
                    name=bs.user.name if bs.user else "",
                    **calculate_shooting_box_score(bs)
                )
            )
        else:
            # Default all stats to 0 if no box score exists
            team_scores.append(
                ReadShootingBoxScore(
                    user_id=user_id,
                    name=participant.user.name if participant.user else "",
                    fgm=0,
                    fga=0,
                    fg_pct=0,
                    threepm=0,
                    threepa=0,
                    threep_pct=0,
                    ftm=0,
                    fta=0,
                    ft_pct=0,
                    efg_pct=0,
                    ts_pct=0
                )
            )

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


def create_comment(db: Session, comments: List[CreateComment]):
    created_comments = [create_model(db, Comment, comment) for comment in comments]

    db.add_all(created_comments)
    db.commit()
    for comment in created_comments:
        db.refresh(comment)

    return created_comments



def get_comments(db:Session, game_id: UUID):
    comments = db.execute(
        select(Comment)
        .where(Comment.game_id == game_id)
    ).scalars().all()

    if not comments:
        return []

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

def delete_play_by_play(db:Session, play_by_play_id:UUID):
    play_by_play = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.id == play_by_play_id)
    ).scalar_one_or_none()

    if not play_by_play:
        raise not_found_error()

    db.delete(play_by_play)
    try_commit_db(db,play_by_play)

    return "play_by_play deleted"

def get_subs(db:Session,game_id:UUID):
    subs = db.execute(
        select(Substitution)
        .where(Substitution.game_id == game_id)
    ).scalars().all()

    if not subs:
        return []

    return subs

def add_subs(db:Session,new_sub:List[CreateSubs]):
    new_subs = []
    for sub in new_sub:
        subs = create_model(db,Substitution,sub)
        try_commit_db(db,subs)
        new_subs.append(subs)

    return new_subs

def get_team_players(db: Session, team_id: UUID):
    memberships = db.execute(
        select(TeamMembership)
        .where(TeamMembership.team_id == team_id, TeamMembership.role == "player")
    ).scalars().all()
    if not memberships:
        raise not_found_error()
    players = []
    for m in memberships:
        user = db.execute(select(User).where(User.id == m.user_id)).scalar_one_or_none()
        if user:
            players.append({"user_id": user.id, "name": user.name})
    if not players:
        raise not_found_error()
    return players
