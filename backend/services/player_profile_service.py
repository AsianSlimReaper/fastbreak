from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game,TeamMembership, GameParticipant,User
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *

#purpose: calculate the total points scored by a player in a game
#inputs: twopm, threepm, ftm
##outputs: total points scored
def calculate_total_points(box_scores):
    # Helper function to calculate points from box scores
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

#purpose: determine the game result based on team and opponent points
#inputs: team_pts, opp_pts
#outputs: result string indicating win, loss, or tie
def get_game_result_and_scores(box_scores):
    # calculate total points for team and opponent
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])

    # determine the game result
    result = game_result(team_pts, opp_pts)

    # return the scores and result
    return team_pts, opp_pts, result

#purpose: retrieve box scores for a specific game, user, and team
#inputs: game_id, user_id, team_id, db session
#outputs: BoxScore object or None if not found
def get_game_box_scores(game_id: UUID, user_id:UUID,team_id:UUID, db: Session):
    # Query the database for the box score of a specific game, user, and team
    return db.execute(
        select(BoxScore).
        where(BoxScore.game_id == game_id,
              BoxScore.user_id == user_id,
              BoxScore.team_id == team_id,
              BoxScore.is_opponent== False)
                      ).scalar_one_or_none()

#purpose: retrieve player card data for a specific team
#inputs: db session, team_id
#outputs: list of player card data or empty dict if no players found
def get_player_card_data(db: Session, team_id: UUID):
    # Query the database for team memberships with role 'player'
    memberships = db.execute(
        select(TeamMembership)
        .where(
            TeamMembership.team_id == team_id,
            TeamMembership.role == "player"
        )
    ).scalars().all()

    # If no memberships found, return an empty dict
    if not memberships:
        return {}

    # Prepare player card data
    player_cards = []
    # Loop through each membership to gather player information
    for membership in memberships:
        # Query the database for the user's name based on user_id
        user = db.execute(
            select(User.name)
            .where(User.id == membership.user_id)
        ).scalar_one_or_none()

        # If user not found, skip to the next membership
        if not user:
            continue
        # Append player information to the player_cards list
        player_cards.append({
            "user_name": user,
            "user_id": membership.user_id,
            "team_id": membership.team_id,
            "jersey_number": membership.jersey_number,
            "position": membership.position,
            })

    # Return the list of player cards
    return player_cards

#purpose: retrieve player profile data for a specific team and user
#inputs: db session, team_id, user_id
#outputs: player profile data including stats and recent games
def get_player_profile(db:Session, team_id:UUID, user_id: UUID):
    # Query the database for the team membership of the user in the specified team
    membership = db.execute(
        select(TeamMembership).where(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == user_id,
            TeamMembership.role == "player"
        )
    ).scalar_one_or_none()
    # If no membership found, raise an HTTP exception with a 404 status code
    if not membership:
        raise HTTPException(status_code=404, detail="Player not found in team")

    # Query the database for the user's name based on user_id
    user_name = db.execute(
        select(User.name).where(User.id == user_id)
    ).scalar_one_or_none()

    # If username not found, raise an HTTP exception with a 404 status code
    if not user_name:
        raise HTTPException(status_code=404, detail="User not found")

    # Prepare the membership data to be returned
    membership_data= {
        "user_name": user_name,
        "user_id": membership.user_id,
        "team_id": membership.team_id,
        "jersey_number": membership.jersey_number,
        "position": membership.position
    }

    # Query the database for box scores of the user in the specified team
    stats = db.execute(
        select(BoxScore).where(
            BoxScore.team_id == team_id,
            BoxScore.user_id == user_id,
            BoxScore.is_opponent == False
        )
    ).scalars().all()

    #initialize variables to calculate player stats
    total_points = total_assists = total_steals = total_blocks = total_rebounds = 0
    total_fga = total_fgm = total_threepa = total_threepm = total_ftm = total_fta = 0
    total_plus_minus = total_turnovers =0
    num_games = len(stats)

    # iterate through each box score to calculate the stats
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

    # Calculate player stats based on the total values
    player_stats ={
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

    # Query the database for recent games of the user in the specified team
    games = db.execute(
        select(Game) # Select Game model to get game details
        .join(GameParticipant) # Join Game with GameParticipant to filter by user
        .where(GameParticipant.user_id == user_id,
               Game.team_id == team_id)
        .order_by(Game.date.desc()) #order by date in descending order
        .limit(12) #limit to the last 12 games
    ).scalars().all()

    # Initialize a list to store recent game statistics
    recent_games = []

    # Iterate through each game to calculate recent game statistics
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

        # Append the game statistics to the recent_games list
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

    # return the player stats, recent games, and membership data
    return({
        "stats": player_stats,
        "recent_games": recent_games,
        "player": membership_data
    })
