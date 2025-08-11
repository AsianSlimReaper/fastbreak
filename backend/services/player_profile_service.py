from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game,TeamMembership, GameParticipant,User
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *

def calculate_total_points(box_scores):
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

def get_game_result_and_scores(box_scores):
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])
    result = game_result(team_pts, opp_pts)
    return team_pts, opp_pts, result

def get_game_box_scores(game_id: UUID, user_id:UUID,team_id:UUID, db: Session):
    return db.execute(
        select(BoxScore).
        where(BoxScore.game_id == game_id,
              BoxScore.user_id == user_id,
              BoxScore.team_id == team_id,
              BoxScore.is_opponent== False)
                      ).scalar_one_or_none()


def get_player_card_data(db: Session, team_id: UUID):
    memberships = db.execute(
        select(TeamMembership)
        .where(
            TeamMembership.team_id == team_id,
            TeamMembership.role == "player"
        )
    ).scalars().all()

    if not memberships:
        return {}

    player_cards = []
    for membership in memberships:
        user = db.execute(
            select(User.name)
            .where(User.id == membership.user_id)
        ).scalar_one_or_none()

        if not user:
            continue

        player_cards.append({
            "user_name": user,
            "user_id": membership.user_id,
            "team_id": membership.team_id,
            "jersey_number": membership.jersey_number,
            "position": membership.position,
            })

    return player_cards

def get_player_profile(db:Session, team_id:UUID, user_id: UUID):
    membership = db.execute(
        select(TeamMembership).where(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == user_id,
            TeamMembership.role == "player"
        )
    ).scalar_one_or_none()

    if not membership:
        raise HTTPException(status_code=404, detail="Player not found in team")

    user_name = db.execute(
        select(User.name).where(User.id == user_id)
    ).scalar_one_or_none()

    if not user_name:
        raise HTTPException(status_code=404, detail="User not found")

    membership_data= {
        "user_name": user_name,
        "user_id": membership.user_id,
        "team_id": membership.team_id,
        "jersey_number": membership.jersey_number,
        "position": membership.position
    }

    stats = db.execute(
        select(BoxScore).where(
            BoxScore.team_id == team_id,
            BoxScore.user_id == user_id,
            BoxScore.is_opponent == False
        )
    ).scalars().all()

    total_points = total_assists = total_steals = total_blocks = total_rebounds = 0
    total_fga = total_fgm = total_threepa = total_threepm = total_ftm = total_fta = 0
    total_plus_minus = total_turnovers = total_minutes =0
    num_games = len(stats)

    for stat in stats:
        total_points += calculate_pts(stat.twopm, stat.threepm, stat.ftm)
        total_assists += stat.ast
        total_steals += stat.stl
        total_blocks += stat.blk
        total_rebounds += stat.oreb + stat.dreb
        total_plus_minus += stat.plus_minus
        total_turnovers += stat.tov
        total_fga += calculate_fga(stat.twopa, stat.threepa)
        total_fgm += calculate_fgm(stat.twopm, stat.threepm)
        total_threepa += stat.threepa
        total_threepm += stat.threepm
        total_ftm += stat.ftm
        total_fta += stat.fta
        total_minutes += stat.mins

    player_stats ={
        "mins":round(total_minutes,1) if num_games else 0.0,
        "ppg": round(total_points / num_games, 1) if num_games else 0.0,
        "apg": round(total_assists / num_games, 1) if num_games else 0.0,
        "rpg": round(total_rebounds / num_games, 1) if num_games else 0.0,
        "spg": round(total_steals / num_games, 1) if num_games else 0.0,
        "bpg": round(total_blocks / num_games, 1) if num_games else 0.0,
        "fg_pct": round(calculate_fg_percent(total_fgm, total_fga), 1) if num_games else 0.0,
        "threep_pct": round(calculate_3p_percent(total_threepm, total_threepa) , 1) if num_games else 0.0,
        "ft_pct": round(calculate_ft_percent(total_ftm, total_fta), 1) if num_games else 0.0,
        "ts_pct": round(calculate_ts_percent(total_points,total_fgm,total_fta), 1) if num_games else 0.0,
        "efg_pct": round(calculate_efg_percent(total_fgm,total_threepm,total_fga), 1) if num_games else 0.0,
        "plus_minus":round(total_plus_minus/num_games,1) if num_games else 0.0,
        "tov":round(total_turnovers/num_games,1) if num_games else 0.0
    }

    games = db.execute(
        select(Game)
        .join(GameParticipant)
        .where(GameParticipant.user_id == user_id)
        .order_by(Game.date.desc())
        .limit(12)
    ).scalars().all()

    recent_games = []

    for game in games:
        box_score = get_game_box_scores(game.id, user_id,team_id,db)
        pts = calculate_pts(box_score.twopm,box_score.threepm,box_score.ftm)
        reb = calculate_rebounds(box_score.oreb, box_score.dreb)
        fgm = calculate_fgm(box_score.twopm,box_score.threepm)
        fga = calculate_fga(box_score.twopa,box_score.threepa)
        efg_pct = calculate_efg_percent(fgm,box_score.threepm,fga)
        eff = calculate_efficiency(
            pts,reb,box_score.ast,box_score.stl,
            box_score.blk,fga,fgm,box_score.fta,
            box_score.ftm,box_score.tov)

        recent_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "pts": pts,
            "ast": box_score.ast,
            "reb": reb,
            "efg_pct": efg_pct,
            "plus_minus" : box_score.plus_minus,
            "efficiency" : eff
        })

    return({
        "stats": player_stats,
        "recent_games": recent_games,
        "player": membership_data
    })
