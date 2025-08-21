from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, Team, User, GameParticipant
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

#extracted functions

#purpose: Calculate points based on two-point field goals, three-point field goals, and free throws
#input: twopm (two-point field goals made), threepm (three-point field goals made), ftm (free throws made)
#output: total points scored
def calculate_total_points(box_scores):
    # Calculate total points from a list of box scores
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

#purpose: Calculate the game result based on team points and opponent points
#input: team_pts (points scored by the team), opp_pts (points scored by the opponent)
#output: "win", "loss", or "draw" based on the comparison of team points and opponent points
def get_game_result_and_scores(box_scores):
    # Calculate the game result and scores from a list of box scores
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])
    result = game_result(team_pts, opp_pts)

    # Return the team points, opponent points, and result
    return team_pts, opp_pts, result

#purpose: Calculate the total possessions based on field goal attempts, free throw attempts, offensive rebounds, and turnovers
#input: box_scores (list of BoxScore objects)
#output: total possessions calculated from the box scores
def calculate_individual_averages(stats):
    # initialize totals
    total_points = total_assists = total_steals = total_blocks = total_rebounds = 0
    # calculate number of games
    num_games = len(stats)

    # iterate through each box score to accumulate stats
    for stat in stats:
        # calculate points for the current box score
        total_points += calculate_pts(stat.twopm, stat.threepm, stat.ftm)
        # accumulate other stats
        total_assists += stat.ast
        total_steals += stat.stl
        total_blocks += stat.blk
        total_rebounds += stat.oreb + stat.dreb

    # calculate averages and return as a dictionary
    return {
        "ppg": round(total_points / num_games, 1),
        "apg": round(total_assists / num_games, 1),
        "rpg": round(total_rebounds / num_games, 1),
        "spg": round(total_steals / num_games, 1),
        "bpg": round(total_blocks / num_games, 1),
    } if num_games else {
        #if no games, return zero averages
        "ppg": 0.0, "apg": 0.0, "rpg": 0.0, "spg": 0.0, "bpg": 0.0
    }

#purpose: Calculate the number of field goal attempts based on two-point and three-point attempts
#input: twopa (two-point field goal attempts), threepa (three-point field goal attempts)
#output: total field goal attempts calculated from two-point and three-point attempts
def calculate_total_possessions(box_scores):
    #intialise total possessions
    total_poss = 0
    # iterate through each box score to calculate total possessions
    for box_score in box_scores:
        # calculate field goal attempts
        fga = calculate_fga(box_score.twopa, box_score.threepa)
        # accumulate total possessions using the calculate_possessions function
        total_poss += calculate_possessions(fga, box_score.fta, box_score.oreb, box_score.tov)
    # return the total possessions
    return total_poss

#purpose: Get all box scores for a specific game
#input: game_id (UUID of the game), db (database session)
#output: list of BoxScore objects associated with the game
def get_game_box_scores(game_id: UUID, db: Session):
    # Query the database to get all box scores for the specified game
    return db.execute(select(BoxScore).where(BoxScore.game_id == game_id)).scalars().all()

#main services functions

#purpose: Get team statistics for the dashboard based on team ID
#input: team_id (UUID of the team), db (database session)
#output: dictionary containing team statistics such as wins, losses, draws, games played, offensive rating, defensive rating, and net rating
def get_dashboard_team_stats(team_id: UUID, db:Session):

    # Query the database to get the team by ID
    team = db.execute(
        select(Team).where(Team.id == team_id)
    ).scalar_one_or_none()

    # If the team is not found, raise a 404 HTTP exception
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Query the database to get all games associated with the team
    games = db.execute(
        select(Game).where(Game.team_id == team_id)
    ).scalars().all()

    # If no games are found, return a dictionary with zero statistics
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

    # Initialize variables to accumulate statistics
    total_pts = total_opp_pts = 0
    total_poss = total_opp_poss = 0
    wins = losses = draws = 0

    # Iterate through each game to calculate statistics
    for game in games:
        # Query the database to get box scores for the team and opponent in the current game
        team_stat = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id, BoxScore.is_opponent == False)
        ).scalars().all()

        # Query the database to get box scores for the opponent in the current game
        opp_stats = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id, BoxScore.is_opponent == True)
        ).scalars().all()

        # calculate total points, possessions
        team_pts = calculate_total_points(team_stat)
        opp_pts = calculate_total_points(opp_stats)
        team_poss = calculate_total_possessions(team_stat)
        opp_poss = calculate_total_possessions(opp_stats)

        # accumulate totals
        total_pts += team_pts
        total_opp_pts += opp_pts
        total_poss += team_poss
        total_opp_poss += opp_poss

        # determine the game result
        result = game_result(team_pts, opp_pts)
        if result == "win":
            wins += 1
        elif result == "loss":
            losses += 1
        elif result == "draw":
            draws += 1

    # Calculate offensive rating, defensive rating, and net rating
    off_rtg = calculate_off_rtg(total_pts, total_poss)
    def_rtg = calculate_def_rtg(total_opp_pts, total_opp_poss)
    net_rtg = calculate_net_rtg(off_rtg, def_rtg)

    # Return a dictionary with the calculated statistics
    return({
    "wins" : wins,
    "losses": losses,
    "draws": draws,
    "games_played": wins + losses + draws,
    "off_rtg": off_rtg,
    "def_rtg": def_rtg,
    "net_rtg": net_rtg
    })

#purpose: Get individual statistics for a specific player in a team
#input: user_id (UUID of the player), team_id (UUID of the team), db (database session)
#output: dictionary containing individual averages such as points per game (ppg), assists per game (apg), rebounds per game (rpg), steals per game (spg), and blocks per game (bpg)
def get_dashboard_player_individual_stats(user_id: UUID, team_id: UUID, db: Session):
    # Query the database to get all box scores for the specified user and team
    stats = db.execute(
        select(BoxScore).where(
            (BoxScore.user_id == user_id) & (BoxScore.team_id == team_id)
        )
    ).scalars().all()

    # return individual averages
    return calculate_individual_averages(stats)

#purpose: Get all individual statistics for a team
#input: team_id (UUID of the team), db (database session)
#output: list of dictionaries containing user ID, name, and individual averages such as points per game (ppg), assists per game (apg), rebounds per game (rpg), steals per game (spg), and blocks per game (bpg)
def get_dashboard_all_individual_stats(team_id: UUID, db:Session):
    # Query the database to get all box scores for the specified team
    stats = db.execute(
        select(BoxScore).where(BoxScore.team_id == team_id)
    ).scalars().all()

    # If no stats are found, return an empty list
    if not stats:
        return []

    # Group stats by user_id
    user_stats = defaultdict(list)
    for stat in stats:
        user_stats[stat.user_id].append(stat)

    #intialize results list
    results = []

    # Calculate individual averages for each user and append to results
    for user_id, stat_list in user_stats.items():

        # Calculate individual averages for the user
        averages = calculate_individual_averages(stat_list)
        # Query the database to get the user by ID
        user = db.get(User, user_id)
        # Append the user ID, name, and averages to the results list
        results.append({
            "user_id": user_id,
            "name": user.name if user else "Unknown",
            **averages
        })

    # Sort results by points per game (ppg) in descending order
    return results

#purpose: Get recent games for a player in a specific team
#input: user_id (UUID of the player), team_id (UUID of the team), db (database session)
#output: list of dictionaries containing game date, opponent, team score, opponent score, and result for the player's recent games
def get_player_recent_games(user_id: UUID,team_id:UUID, db: Session):
    # Query the database to get the most recent 8 games for the player in the specified team
    games = db.execute(
        select(Game) # the model im selecting from
        .join(GameParticipant) #joined with game participant
        .where(GameParticipant.user_id == user_id,
               Game.team_id == team_id)
        #order by date in descending order
        .order_by(Game.date.desc())
        .limit(8) #limit to 8 games
    ).scalars().all()

    #initialize list to store recent games
    player_recent_games = []

    # Iterate through each game to get box scores and calculate results
    for game in games:
        # Get all box scores for the current game
        box_scores = get_game_box_scores(game.id, db)
        # get the team score, opponent score, and result
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        # Append the game details to the player_recent_games list
        player_recent_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    # Return the list of recent games for the player
    return player_recent_games

#purpose: Get recent games for a team
#input: team_id (UUID of the team), db (database session)
#output: list of dictionaries containing game date, opponent, team score, opponent score, and result for the team's recent games
def get_team_recent_games(team_id:UUID, db:Session):
    # Query the database to get the most recent 8 games for the specified team
    games = db.execute(
        select(Game)
        .where(Game.team_id == team_id)
        .order_by(Game.date.desc())
        .limit(8)
    ).scalars().all()

    # Initialize a list to store recent games for the team
    coach_recent_games = []

    # Iterate through each game to get box scores and calculate results
    for game in games:
        # Get all box scores for the current game
        box_scores = get_game_box_scores(game.id, db)
        # Get the team score, opponent score, and result
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        # Append the game details to the coach_recent_games list
        coach_recent_games.append({
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    # Return the list of recent games for the team
    return coach_recent_games