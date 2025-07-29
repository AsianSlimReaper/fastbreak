from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, Team, User, GameParticipant
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

#extracted functions

def calculate_total_points(box_scores):
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

def get_game_result_and_scores(box_scores):
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])
    result = game_result(team_pts, opp_pts)
    return team_pts, opp_pts, result

def calculate_individual_averages(stats):
    total_points = total_assists = total_steals = total_blocks = total_rebounds = 0
    num_games = len(stats)

    for stat in stats:
        total_points += calculate_pts(stat.twopm, stat.threepm, stat.ftm)
        total_assists += stat.ast
        total_steals += stat.stl
        total_blocks += stat.blk
        total_rebounds += stat.oreb + stat.dreb

    return {
        "ppg": round(total_points / num_games, 1),
        "apg": round(total_assists / num_games, 1),
        "rpg": round(total_rebounds / num_games, 1),
        "spg": round(total_steals / num_games, 1),
        "bpg": round(total_blocks / num_games, 1),
    } if num_games else {
        "ppg": 0.0, "apg": 0.0, "rpg": 0.0, "spg": 0.0, "bpg": 0.0
    }

def calculate_total_possessions(box_scores):
    total_poss = 0
    for box_score in box_scores:
        fga = calculate_fga(box_score.twopa, box_score.threepa)
        total_poss += calculate_possessions(fga, box_score.fta, box_score.oreb, box_score.tov)
    return total_poss

def get_game_box_scores(game_id: UUID, db: Session):
    return db.execute(select(BoxScore).where(BoxScore.game_id == game_id)).scalars().all()

#main services functions

def get_dashboard_team_stats(team_id: UUID, db:Session):
    team = db.execute(
        select(Team).where(Team.id == team_id)
    ).scalar_one_or_none()

    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    games = db.execute(
        select(Game).where(Game.team_id == team_id)
    ).scalars().all()

    if not games:
        return({
        "wins" : 0,
        "losses": 0,
        "draws": 0,
        "games_played": 0,
        "off_rtg": 0.0,
        "def_rtg": 0.0,
        "net_rtg": 0.0
        })

    total_pts = total_opp_pts = 0
    total_poss = total_opp_poss = 0
    total_minutes = 0
    wins = losses = draws = 0

    for game in games:
        team_stat = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id, BoxScore.is_opponent == False)
        ).scalars().all()

        opp_stats = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id, BoxScore.is_opponent == True)
        ).scalars().all()

        team_pts = calculate_total_points(team_stat)
        opp_pts = calculate_total_points(opp_stats)
        team_poss = calculate_total_possessions(team_stat)
        opp_poss = calculate_total_possessions(opp_stats)

        total_pts += team_pts
        total_opp_pts += opp_pts
        total_poss += team_poss
        total_opp_poss += opp_poss
        total_minutes += sum(box_score.mins for box_score in team_stat)/5

        result = game_result(team_pts, opp_pts)
        if result == "win":
            wins += 1
        elif result == "loss":
            losses += 1
        elif result == "draw":
            draws += 1

    off_rtg = calculate_off_rtg(total_pts, total_poss)
    def_rtg = calculate_def_rtg(total_opp_pts, total_opp_poss)
    net_rtg = calculate_net_rtg(off_rtg, def_rtg)

    return({
    "wins" : wins,
    "losses": losses,
    "draws": draws,
    "games_played": wins + losses + draws,
    "off_rtg": off_rtg,
    "def_rtg": def_rtg,
    "net_rtg": net_rtg
    })

def get_dashboard_player_individual_stats(user_id: UUID, team_id: UUID, db: Session):
    stats = db.execute(
        select(BoxScore).where(
            (BoxScore.user_id == user_id) & (BoxScore.team_id == team_id)
        )
    ).scalars().all()

    return calculate_individual_averages(stats)

def get_dashboard_all_individual_stats(team_id: UUID, db:Session):
    stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id)
    ).scalars().all()

    if not stats:
        return []

    user_stats = defaultdict(list)
    for stat in stats:
        user_stats[stat.user_id].append(stat)

    results = []

    for user_id, stat_list in user_stats.items():
        averages = calculate_individual_averages(stat_list)
        user = db.get(User, user_id)
        results.append({
            "user_id": user_id,
            "name": user.name if user else "Unknown",
            **averages
        })

    return results

def get_player_recent_games(user_id: UUID, db: Session):
    games = db.execute(
        select(Game)
        .join(GameParticipant)
        .where(GameParticipant.user_id == user_id)
        .order_by(Game.date.desc())
        .limit(8)
    ).scalars().all()

    player_recent_games = []

    for game in games:
        box_scores = get_game_box_scores(game.id, db)
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        player_recent_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    return player_recent_games

def get_team_recent_games(team_id:UUID, db:Session):
    games = db.execute(
        select(Game)
        .where(Game.team_id == team_id)
        .order_by(Game.date.desc())
        .limit(8)
    ).scalars().all()

    coach_recent_games = []

    for game in games:
        box_scores = get_game_box_scores(game.id, db)
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        coach_recent_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    return coach_recent_games