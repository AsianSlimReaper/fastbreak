from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, User, GameParticipant, PlayByPlay, Comment
from fastapi import HTTPException
from uuid import UUID
from backend.schemas.film_room import NewGame, NewGameParticipant, NewBoxScore, NewComment, NewPlayByPlay, UpdateGame, \
    UpdateBoxScore, UpdateComment
from backend.utils.stat_calculations import *
from collections import defaultdict

def calculate_basic_box_score(box_score):
    pts =calculate_pts(box_score.twopm,box_score.threepm,box_score.ftm)
    reb =calculate_rebounds(box_score.oreb,box_score.dreb)
    fgm = calculate_fgm(box_score.twopm,box_score.threepm)
    fga = calculate_fga(box_score.twopa,box_score.threepa)
    return ({
        "mins":box_score.mins,
        "pts":pts,
        "ast": box_score.ast,
        "reb": reb,
        "oreb":box_score.oreb,
        "dreb":box_score.dreb,
        "stl":box_score.stl,
        "blk":box_score.blk,
        "tov":box_score.tov,
        "fls":box_score.fls,
        "plus_minus":box_score.plus_minus,
        "efficiency":calculate_efficiency(pts,reb,box_score.ast,box_score.stl,
                                         box_score.blk,fga,fgm,box_score.fta,
                                         box_score.ftm,box_score.tov),

    })

def calculate_shooting_box_score(box_score):
    pts = calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm)
    fgm = calculate_fgm(box_score.twopm, box_score.threepm)
    fga = calculate_fga(box_score.twopa, box_score.threepa)

    return({
        "fgm": fgm,
        "fga": fga,
        "fg_pct": calculate_fg_percent(fgm, fga),
        "three_pm": box_score.threepm,
        "three_pa": box_score.threepa,
        "threep_pct": calculate_3p_percent(box_score.threepm,box_score.threepa),
        "ftm": box_score.ftm,
        "fta": box_score.fta,
        "ft_pct": calculate_ft_percent(box_score.ftm, box_score.fta),
        "efg_pct":calculate_efg_percent(fgm,box_score.threepm,fga),
        "ts_pct":calculate_ts_percent(pts,fga,box_score.fta)
    })


def create_new_game(db:Session, new_game:NewGame):
    game = Game(
        team_id=new_game.team_id,
        date=new_game.date,
        opponent=new_game.opponent,
        video_url=new_game.video_url
    )

    db.add(game)
    db.commit()
    db.refresh(game)

def add_new_game_participant(db:Session,new_participant:NewGameParticipant):
    participant = GameParticipant(
        user_id=new_participant.user_id,
        game_id=new_participant.game_id
    )

    db.add(participant)
    db.commit()
    db.refresh(participant)

def add_new_box_score(db:Session,new_box_score:NewBoxScore):
    box_score = BoxScore(
        game_id=new_box_score.game_id,
        user_id=new_box_score.user_id,
        team_id=new_box_score.team_id,
        is_opponent=new_box_score.is_opponent if new_box_score.is_opponent else False,
        mins=new_box_score.mins,
        ast=new_box_score.ast,
        oreb=new_box_score.oreb,
        dreb=new_box_score.dreb,
        stl=new_box_score.stl,
        blk=new_box_score.blk,
        tov=new_box_score.tov,
        fls=new_box_score.fls,
        twopm=new_box_score.twopm,
        twopa=new_box_score.twopa,
        threepm=new_box_score.threepm,
        threepa=new_box_score.threepa,
        ftm=new_box_score.ftm,
        fta=new_box_score.fta,
        plus_minus=new_box_score.plus_minus
    )

    db.add(box_score)
    db.commit()
    db.refresh(box_score)

def add_new_comment(db:Session, new_comment:NewComment):
    comment = Comment(
        game_id=new_comment.game_id,
        timestamp_seconds=new_comment.timestamp_seconds,
        comment_text=new_comment.comment_text
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

def add_new_play_by_play(db:Session, new_play_by_play:NewPlayByPlay):
    play_by_play = PlayByPlay(
        game_id=new_play_by_play.game_id,
        user_id=new_play_by_play.user_id,
        timestamp_seconds=new_play_by_play.timestamp_seconds,
        event_type=new_play_by_play.event_type,
        description=new_play_by_play.description
    )

    db.add(play_by_play)
    db.commit()
    db.refresh(play_by_play)

def get_games_details(db:Session,team_id:UUID):
    games = db.execute(
        select(Game).where(
            Game.team_id == team_id
        )).scalars().all()

    return games

def get_game_by_id(db:Session, game_id:UUID):
    game = db.execute(
        select(Game)
        .where(Game.id == game_id)
    ).scalar_one_or_none()

    return game

def get_games_participants(db: Session, game_id: UUID):
    participant_data = (
        select(User.id, User.name)
        .join(GameParticipant, User.id == GameParticipant.user_id)
        .where(GameParticipant.game_id == game_id)
    )

    results = db.execute(participant_data).all()

    participant_list = [
        {"user_id": str(user_id), "user_name": name}
        for user_id, name in results
    ]

    return participant_list


def get_game_basic_box_score(db: Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore, User.name)
        .join(User, User.id == BoxScore.user_id)
        .where(
            BoxScore.game_id == game_id,
            BoxScore.is_opponent == False
        )
    ).all()


    opponent_box_score = db.execute(
        select(BoxScore).where(
            BoxScore.game_id == game_id,
            BoxScore.is_opponent == True
        )
    ).scalar_one_or_none()

    team_stats = defaultdict(list)
    for box_score, user_name in team_box_scores:
        player_stat = calculate_basic_box_score(box_score)
        team_stats[box_score.user_id].append(player_stat)

    opponent_stats = None
    if opponent_box_score:
        opponent_stats = calculate_basic_box_score(opponent_box_score)

    return {
        "team_box_scores":team_stats,
        "opponent_box_score": opponent_stats
            }

def get_game_shooting_box_score(db:Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore, User.name)
        .join(User, User.id == BoxScore.user_id)
        .where(
            BoxScore.game_id == game_id,
            BoxScore.is_opponent == False
        )
    ).all()

    opponent_box_score = db.execute(
        select(BoxScore).where(
            BoxScore.game_id == game_id,
            BoxScore.is_opponent == True
        )
    ).scalar_one_or_none()

    team_stats = defaultdict(list)
    for box_score, user_name in team_box_scores:
        player_stat = calculate_shooting_box_score(box_score)
        team_stats[box_score.user_id].append(player_stat)

    opponent_stats = None
    if opponent_box_score:
        opponent_stats = calculate_shooting_box_score(opponent_box_score)

    return {
        "team_box_scores": team_stats,
        "opponent_box_score": opponent_stats
    }

def get_game_team_advanced_stat(db:Session, game_id: UUID):
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id,
               BoxScore.is_opponent == False)
    ).scalars().all()

    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id,
               BoxScore.is_opponent == True)
    ).scalars().all()


    total_team_points = sum(calculate_pts(tbs.twopm,tbs.threepm,tbs.ftm) for tbs in team_box_scores)
    total_team_poss = sum(
        calculate_possessions(tbs.twopm+tbs.threepm,tbs.fta,tbs.oreb,tbs.tov) for tbs in team_box_scores)
    total_opp_points =  sum(calculate_pts(obs.twopm,obs.threepm,obs.ftm) for obs in opponent_box_scores)
    total_opp_poss = sum(
        calculate_possessions(obs.twopm + obs.threepm, obs.fta, obs.oreb, obs.tov) for obs in opponent_box_scores)
    total_mins = sum(tbs.mins for tbs in team_box_scores)/5

    off_rtg = calculate_off_rtg(total_team_points,total_team_poss)
    def_rtg = calculate_def_rtg(total_opp_points,total_opp_poss)
    pace = calculate_pace(total_team_poss,total_opp_poss,total_mins)

    return{
        "off_rtg": off_rtg,
        "def_rtg": def_rtg,
        "pace": pace
    }

def get_game_comments(db:Session, game_id: UUID):
    comments = db.execute(
        select(Comment)
        .where(Comment.game_id == game_id)
    ).scalars().all()

    return comments

def get_game_play_by_play(db:Session, game_id: UUID):
    play_by_play = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.game_id == game_id)
        .order_by(PlayByPlay.timestamp_seconds)
    ).scalars().all()

    return play_by_play

def update_game_details(db:Session,update_game:UpdateGame):
    game = get_game_by_id(db,update_game.game_id)

    if not game:
        raise HTTPException(status_code=404, detail="Game not found")

    if update_game.date:
        game.date = update_game.date

    if update_game.opponent:
        game.opponent = update_game.opponent

    if update_game.video_url:
        game.video_url = update_game.video_url

    db.commit()
    db.refresh(game)

    return game

#loop through box_scores in router
#log changes in frontend to avoid checking all box scores
def update_box_score(db:Session, update_box_score: UpdateBoxScore):
    box_score = db.execute(
        select(BoxScore)
        .where(BoxScore.id == update_box_score.id)
    ).scalars().all()

    if not box_score:
        raise HTTPException(status_code=404, detail="Box score not found")

    if update_box_score.mins:
        box_score.mins = update_box_score.mins

    if update_box_score.ast:
        box_score.ast = update_box_score.ast

    if update_box_score.oreb:
        box_score.oreb = update_box_score.oreb

    if update_box_score.stl:
        box_score.stl = update_box_score.stl

    if update_box_score.blk:
        box_score.blk = update_box_score.blk

    if update_box_score.twopm:
        box_score.twopm = update_box_score.twopm

    if update_box_score.twopa:
        box_score.twopa = update_box_score.twopa

    if update_box_score.threepm:
        box_score.threepm = update_box_score.threepm

    if update_box_score.threepa:
        box_score.threepa = update_box_score.threepa

    if update_box_score.ftm:
        box_score.ftm = update_box_score.ftm

    if update_box_score.fta:
        box_score.fta = update_box_score.fta

    if update_box_score.plus_minus:
        box_score.plus_minus = update_box_score.plus_minus

    db.commit()
    db.refresh(box_score)

    return box_score

def update_comment(db:Session, update_comment: UpdateComment):
    comment = db.execute(
        select(Comment)
        .where(Comment.id == update_comment.id)
    )

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if update_comment.timestamp_seconds:
        Comment.timestamp_seconds = update_comment.timestamp_seconds

    if update_comment.comment_text:
        Comment.comment_text = update_comment.comment_text

    db.commit()
    db.refresh(comment)

    return comment