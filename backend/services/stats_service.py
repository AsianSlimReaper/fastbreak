from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, User
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

#extracted functions

def calculate_individual_averages(stats):
    total_points = total_assists = total_d_rebounds = total_o_rebounds = total_rebounds = total_steals = total_blocks = 0
    total_turnovers = total_fouls = total_plus_minus = total_efficiency = 0
    total_minutes = 0
    num_games = len(stats)

    for stat in stats:
        points = calculate_pts(stat.twopm, stat.threepm, stat.ftm)
        total_minutes += stat.mins
        total_points += points
        total_assists += stat.ast
        total_d_rebounds += stat.dreb
        total_o_rebounds += stat.oreb
        total_rebounds += (stat.dreb + stat.oreb)
        total_steals += stat.stl
        total_blocks += stat.blk
        total_turnovers += stat.tov
        total_fouls += stat.fls
        total_plus_minus += stat.plus_minus
        total_efficiency += calculate_efficiency(points,stat.reb,stat.ast,stat.stl,stat.blk,
                                                 stat.twopa+stat.threepa,stat.twopm+stat.threepm,
                                                 stat.fta,stat.ftm,stat.tov)

    return{
        "mins": round(total_minutes / num_games, 1),
        "ppg": round(total_points / num_games, 1),
        "apg": round(total_assists / num_games, 1),
        "orpg": round(total_o_rebounds / num_games, 1),
        "drpg": round(total_d_rebounds / num_games, 1),
        "rpg": round(total_rebounds / num_games, 1),
        "spg": round(total_steals / num_games, 1),
        "bpg": round(total_blocks / num_games, 1),
        "tpg": round(total_turnovers / num_games, 1),
        "fpg": round(total_fouls / num_games, 1),
        "plus_minus": round(total_plus_minus / num_games, 1),
        "efficiency": round(total_efficiency / num_games, 1)
    } if num_games else {
        "ppg": 0.0, "apg": 0.0, "rpg": 0.0,"orpg:": 0.0,"drpg": 0.0, "spg": 0.0, "bpg": 0.0,
        "tpg": 0.0, "fpg": 0.0, "plus_minus": 0.0, "efficiency": 0.0
    }

#main functions
def get_individual_basic_stats(team_id: UUID, db: Session):
    stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id)
    ).scalars().all()

    user_stats = defaultdict(list)
    for stat in stats:
        user_stats[stat.user_id].append(stat)

    results = []

    for user_id, stat_list in user_stats.items():
        averages = calculate_individual_averages(stat_list)
        user = db.get(User, user_id)
        results.append({
            "user_id": user_id,
            "user_name": user.name if user else "unknown",
            **averages
        })

    return results

def get_team_basic_stats(team_id: UUID, db: Session):
    team_stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id, BoxScore.is_opponent == False)
    ).scalars().all()

    opp_stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id, BoxScore.is_opponent == True)
    ).scalars().all()

def get_individual_shooting_stats(team_id: UUID, user_id:UUID, db: Session):
    pass

def get_team_shooting_stats(team_id: UUID, db: Session):
    pass
