from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, User, Team, Game
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

#extracted functions
def calculate_total_points(box_scores):
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

def calculate_total_possessions(box_scores):
    total_poss = 0
    for box_score in box_scores:
        fga = calculate_fga(box_score.twopa, box_score.threepa)
        total_poss += calculate_possessions(fga, box_score.fta, box_score.oreb, box_score.tov)
    return total_poss

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
        "ppg": 0.0, "apg": 0.0, "rpg": 0.0,"orpg": 0.0,"drpg": 0.0, "spg": 0.0, "bpg": 0.0,
        "mins": 0.0, "ast": 0.0, "oreb": 0.0, "dreb": 0.0, "reb": 0.0, "stl": 0.0, "blk": 0.0,
        "tpg": 0.0, "fpg": 0.0, "plus_minus": 0.0, "efficiency": 0.0
    }

def calculate_shooting_averages(stats):
    total_twopm = total_twopa = total_threepm = total_threepa = total_ftm = total_fta = 0
    num_games = len(stats)

    for stat in stats:
        total_twopm += stat.twopm
        total_twopa += stat.twopa
        total_threepm += stat.threepm
        total_threepa += stat.threepa
        total_ftm += stat.ftm
        total_fta += stat.fta

    total_fgm = total_twopm + total_threepm
    total_fga = total_twopa + total_threepa
    total_pts = calculate_pts(total_twopm, total_threepm, total_ftm)

    return {
        "fgm": round(total_fgm / num_games, 1),
        "fga": round(total_fga / num_games, 1),
        "fg_pct": round(calculate_fg_percent(total_fgm, total_fga), 3) if total_fga > 0 else 0.0,
        "two_pm": round(total_twopm / num_games, 1),
        "two_pa": round(total_twopa / num_games, 1),
        "twop_pct": round(calculate_2p_percent(total_twopm, total_twopa), 3) if total_twopa > 0 else 0.0,
        "three_pm": round(total_threepm / num_games, 1),
        "three_pa": round(total_threepa / num_games, 1),
        "threep_pct": round(calculate_3p_percent(total_threepm, total_threepa), 3) if total_threepa > 0 else 0.0,
        "ftm": round(total_ftm / num_games, 1),
        "fta": round(total_fta / num_games, 1),
        "ft_pct": round(calculate_ft_percent(total_ftm, total_fta), 3) if total_fta > 0 else 0.0,
        "efg_pct": round(calculate_efg_percent(total_fgm, total_threepm, total_fga), 3) if total_fga > 0 else 0.0,
        "ts_pct": round(calculate_ts_percent(total_pts, total_fga, total_fta), 3) if total_fga > 0 else 0.0
    }

#main functions
def get_individual_basic_stats(team_id: UUID, db: Session):
    stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id, BoxScore.is_opponent == False)
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
    team = db.execute(
        select(Team).where(Team.id == team_id)
    ).scalar_one_or_none()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    games = db.execute(
        select(Game).where(Game.team_id == team_id)
    ).scalars().all()

    if not games:
        return {
            "wins": 0,
            "losses": 0,
            "draws": 0,
            "points_for": 0.0,
            "points_against": 0.0,
            "ast": 0.0,
            "oreb": 0.0,
            "dreb": 0.0,
            "reb": 0.0,
            "stl": 0.0,
            "blk": 0.0,
            "tov": 0.0,
            "fls": 0.0,
            "off_rtg": 0.0,
            "def_rtg": 0.0,
            "net_rtg": 0.0,
            "pace": 0.0
        }

    total_team_pts = total_opp_pts = 0
    total_team_poss = total_opp_poss = 0
    total_minutes = 0
    wins = losses = draws = 0
    total_assists = total_o_reb = total_d_reb = total_reb = total_steals = total_blocks = 0
    total_turnovers = total_fouls = 0

    for game in games:
        team_stats = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id,
                BoxScore.is_opponent == False)
        ).scalars().all()

        opp_stats = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id,
                BoxScore.is_opponent == True)
        ).scalars().all()

        team_pts = calculate_total_points(team_stats)
        opp_pts = calculate_total_points(opp_stats)
        team_poss = calculate_total_possessions(team_stats)
        opp_poss = calculate_total_possessions(opp_stats)

        total_team_pts += team_pts
        total_opp_pts += opp_pts
        total_team_poss += team_poss
        total_opp_poss += opp_poss
        total_minutes += sum(box_score.mins for box_score in team_stats) / 5
        total_assists += sum(box_score.ast for box_score in team_stats)
        total_o_reb += sum(box_score.oreb for box_score in team_stats)
        total_d_reb += sum(box_score.dreb for box_score in team_stats)
        total_reb += sum(box_score.oreb + box_score.dreb for box_score in team_stats)
        total_steals += sum(box_score.stl for box_score in team_stats)
        total_blocks += sum(box_score.blk for box_score in team_stats)
        total_turnovers += sum(box_score.tov for box_score in team_stats)
        total_fouls += sum(box_score.fls for box_score in team_stats)

        result = game_result(team_pts, opp_pts)
        if result == "win":
            wins += 1
        elif result == "loss":
            losses += 1
        elif result == "draw":
            draws += 1

    num_games = len(games)
    off_rtg = calculate_off_rtg(total_team_pts, total_team_poss)
    def_rtg = calculate_def_rtg(total_opp_pts, total_opp_poss)
    net_rtg = calculate_net_rtg(off_rtg, def_rtg)
    pace = calculate_pace(total_team_poss, total_opp_poss, total_minutes)

    return {
        "wins": wins,
        "losses": losses,
        "draws": draws,
        "points_for": round(total_team_pts, 1),
        "points_against": round(total_opp_pts, 1),
        "ast": round(total_assists / num_games, 1),
        "oreb": round(total_o_reb / num_games, 1),
        "dreb": round(total_d_reb / num_games, 1),
        "reb": round(total_reb / num_games, 1),
        "stl": round(total_steals / num_games, 1),
        "blk": round(total_blocks / num_games, 1),
        "tov": round(total_turnovers / num_games, 1),
        "fls": round(total_fouls / num_games, 1),
        "off_rtg": off_rtg,
        "def_rtg": def_rtg,
        "net_rtg": net_rtg,
        "pace": pace
    }

def get_individual_shooting_stats(team_id: UUID, db: Session):
    stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id, BoxScore.is_opponent == False)
    ).scalars().all()

    user_stats = defaultdict(list)
    for stat in stats:
        user_stats[stat.user_id].append(stat)

    results = []

    for user_id, stat_list in user_stats.items():
        averages = calculate_shooting_averages(stat_list)
        user = db.get(User, user_id)
        results.append({
            "user_id": user_id,
            "user_name": user.name if user else "unknown",
            **averages
        })

    return results

def get_team_shooting_stats(team_id: UUID, db: Session):
    stats=db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id, BoxScore.is_opponent == False)
    ).scalars().all()

    if not stats:
        return {
            "fgm": 0.0, "fga": 0.0, "fg_pct": 0.0,
            "two_pm": 0.0, "two_pa": 0.0, "twop_pct": 0.0,
            "three_pm": 0.0, "three_pa": 0.0, "threep_pct": 0.0,
            "ftm": 0.0, "fta": 0.0, "ft_pct": 0.0,
            "efg_pct": 0.0, "ts_pct": 0.0
        }

    averages = calculate_shooting_averages(stats)

    return averages
