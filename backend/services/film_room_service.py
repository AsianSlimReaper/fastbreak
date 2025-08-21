from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_
from backend.models.models import BoxScore, Game, GameParticipant,Comment,PlayByPlay, Substitution, TeamMembership, User
from fastapi import HTTPException
from backend.schemas.film_room import *
from backend.utils.stat_calculations import *


#helper functions

# Calculate points from two-point and three-point field goals and free throws
def calculate_total_points(box_scores):
    # Calculate points for each box score and sum them up
    return sum(calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm) for box_score in box_scores)

# Calculate total possessions for a list of box scores
def calculate_total_possessions(box_scores):
    # initialize total possessions
    total_poss = 0

    # Iterate through each box score and calculate possessions
    for box_score in box_scores:
        # Calculate field goal attempts (fga) and add to total possessions
        fga = calculate_fga(box_score.twopa, box_score.threepa)
        total_poss += calculate_possessions(fga, box_score.fta, box_score.oreb, box_score.tov)

    # Return the total possessions calculated
    return total_poss

# purpose: Determine the game result based on team and opponent points
# inputs: team_pts (int), opp_pts (int)
# outputs: result (int)
def get_game_result_and_scores(box_scores):
    # Calculate total points for team and opponent
    team_pts = calculate_total_points([box_score for box_score in box_scores if not box_score.is_opponent])
    opp_pts = calculate_total_points([box_score for box_score in box_scores if box_score.is_opponent])
    # Determine the game result using the utility function
    result = game_result(team_pts, opp_pts)
    # Return the total points for team, opponent and the game result
    return team_pts, opp_pts, result

#purpose: Get all box scores for a specific game
# inputs: game_id (UUID), db (Session)
# outputs: List of BoxScore objects
def get_game_box_scores(game_id: UUID, db: Session):
    # Query the database to get all box scores for the specified game_id
    return db.execute(select(BoxScore).where(BoxScore.game_id == game_id)).scalars().all()

#purpose: Commit the database session and refresh the model instance
# inputs: db (Session), model_instance (ORM model instance)
# outputs: None
def try_commit_db(db: Session, model_instance):
    # Attempt to commit the changes to the database
    try:
        # Commit the session
        db.commit()
        # Refresh the model instance to reflect the latest state from the database
        db.refresh(model_instance)
    except Exception as e:
        # If an error occurs, rollback the session to revert any changes
        db.rollback()
        # Raise an HTTPException with a 500 status code and the error message
        raise HTTPException(status_code=500, detail=str(e))

# purpose: Raise a 404 Not Found HTTP exception
# inputs: None
# outputs: HTTPException with status code 404 and detail "Not found"
# This function is used to handle cases where a requested resource is not found in the database.
def not_found_error():
    return HTTPException(status_code=404, detail="Not found")

# purpose: Create a new model instance in the database
# inputs: db (Session), model_class (ORM model class), create_schema (Pydantic model schema)
# outputs: model_instance (ORM model instance)
def create_model(db: Session, model_class, create_schema):
    # Create a new instance of the model class using the data from the Pydantic schema
    model_instance = model_class(**create_schema.model_dump()) #model_dump() converts the Pydantic model to a dictionary

    # Add the model instance to the database session
    db.add(model_instance)
    # return the model instance
    return model_instance

# purpose: Update fields of an ORM model instance with values from a Pydantic model
# inputs: model (ORM model instance), update_obj (Pydantic model schema)
# outputs: None
def update_fields(model, update_obj):
    # Iterate through the fields of the Pydantic model and set them on the ORM model instance
    for field, value in update_obj.model_dump(exclude_unset=True).items():
        setattr(model, field, value)

# purpose: Calculate basic box score statistics
# inputs: box_score (BoxScore ORM model instance)
# outputs: Dictionary containing calculated statistics
def calculate_basic_box_score(box_score):
    # Calculate points, rebounds, and efficiency using utility functions
    points = calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm)
    rebounds = calculate_rebounds(box_score.oreb, box_score.dreb)
    efficiency = calculate_efficiency(points, rebounds, box_score.ast, box_score.stl,
                                      box_score.blk, box_score.twopa + box_score.threepa,
                                      box_score.twopm + box_score.threepm, box_score.dreb + box_score.fta,
                                      box_score.oreb + box_score.ftm, box_score.dreb + box_score.tov)

    # Return a dictionary with the calculated statistics
    return ({
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

# purpose: Calculate shooting box score statistics
def calculate_shooting_box_score(box_score):
    # Calculate points, field goals made (fgm), field goals attempted (fga) etc.
    points = calculate_pts(box_score.twopm, box_score.threepm, box_score.ftm)
    fgm = calculate_fgm(box_score.twopm, box_score.threepm)
    fga = calculate_fga(box_score.twopa, box_score.threepa)
    fg_pct = calculate_fg_percent(fgm, fga)
    threep_pct = calculate_3p_percent(box_score.threepm, box_score.threepa)
    ft_pct = calculate_ft_percent(box_score.ftm, box_score.fta)
    efg_pct = calculate_efg_percent(fgm, box_score.threepm, fga)
    ts_pct = calculate_ts_percent(points, fga, box_score.fta)

    # Return a dictionary with the calculated shooting statistics
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

# purpose: Create a new game in the database
# inputs: db (Session), new_game (CreateGame Pydantic model)
# outputs: game (Game ORM model instance)
def create_game(db: Session, new_game=CreateGame):
    # create a new Game instance using the data from the Pydantic model
    game_data = new_game.model_dump(exclude={"participants"}) # exclude participants from the game data and models_dump to convert the Pydantic model to a dictionary

    # If participants are provided, extract them; otherwise, initialize as an empty list
    participants = new_game.participants if hasattr(new_game, "participants") else []

    # creates a new Game instance with the provided data
    game = Game(**game_data) # ** means unpacking the dictionary into keyword arguments
    # add the game instance to the database session
    db.add(game)
    # Commit the session to save the game instance to the database
    try_commit_db(db, game)

    # initialize an empty list to hold participant objects
    participant_objs = []

    # If participants are provided, check if they already exist in the GameParticipant table
    if participants:
        # Iterate through each participant user_id
        for user_id in participants:
            # Check if a GameParticipant already exists for this game and user_id
            exists = db.execute(
                select(GameParticipant).where(
                    GameParticipant.game_id == game.id,
                    GameParticipant.user_id == user_id
                )
            ).scalar_one_or_none()
            if not exists:
                # If not exists, create a new GameParticipant instance
                participant_obj = GameParticipant(game_id=game.id, user_id=user_id)
                db.add(participant_obj)
                participant_objs.append(participant_obj)

        # Commit the session to save all participant instances to the database
        db.commit()
        # Refresh each participant object to reflect the latest state from the database
        for obj in participant_objs:
            db.refresh(obj)

    # Create box scores for all participants (team) if not already present
    #iterate through each user_id in participants
    for user_id in participants:
        # Check if a BoxScore already exists for this game, user_id, and is_opponent=False
        exists = db.execute(
            select(BoxScore).where(
                BoxScore.game_id == game.id,
                BoxScore.user_id == user_id,
                BoxScore.is_opponent == False
            )
        ).scalar_one_or_none() #ensure that we only get one result or None

        # If no box score exists for this user_id, create a new BoxScore instance
        if not exists:
            # Create a new BoxScore instance with default values
            box_score = BoxScore(
                game_id=game.id,
                user_id=user_id,
                team_id=new_game.team_id,
                is_opponent=False,
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
            # Add the new BoxScore instance to the database session
            db.add(box_score)

    # Automatically create an opponent box score row for this game if not already present
    # Check if an opponent box score already exists for this game
    exists_opp = db.execute(
        select(BoxScore).where(
            BoxScore.game_id == game.id,
            BoxScore.is_opponent == True
        )
    ).scalar_one_or_none() #ensure that we only get one result or None
    # If no opponent box score exists, create a new BoxScore instance for the opponent
    if not exists_opp:
        opponent_box = BoxScore(
            game_id=game.id,
            is_opponent=True,
            user_id=None,
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
        # Add the opponent box score instance to the database session
        db.add(opponent_box)
    # Commit the session to save the opponent box score instance to the database
    db.commit()

    # return the created game instance
    return game

# purpose: Get all games for a specific team
# inputs: db (Session), team_id (UUID)
# outputs: List of dictionaries containing game details
def get_all_team_games(db: Session, team_id: UUID):
    # Query the database to get all games for the specified team_id
    games = db.execute(
        select(Game)
        .where(Game.team_id == team_id)
        .order_by(Game.date.desc())
    ).scalars().all()

    # If no games are found, return an empty list
    all_games = []

    # Iterate through each game and retrieve its box scores
    for game in games:
        # Get box scores for the game
        box_scores = get_game_box_scores(game.id, db)
        # If no box scores are found, continue to the next game
        team_score, opponent_score, result = get_game_result_and_scores(box_scores)

        # Append the game details to the all_games list
        all_games.append({
            "game_id":game.id,
            "date": game.date,
            "opponent": game.opponent,
            "team_score": team_score,
            "opponent_score": opponent_score,
            "result": result
        })

    # Return the list of all games with their details
    return all_games

# purpose: Get details of a specific game by its ID
# inputs: db (Session), game_id (UUID)
# outputs: Game ORM model instance or HTTPException if not found
def get_game_details(db: Session, game_id: UUID):
    # Query the database to get the game with the specified game_id
    game = db.execute(
        select(Game)
        .where(Game.id == game_id)
    ).scalar_one_or_none() # scalar_one_or_none() returns a single result or None if no result is found

    # If no game is found, raise a 404 Not Found HTTP exception
    if not game:
        return not_found_error()

    # return the game details
    return game

# purpose: Update details of a specific game by its ID
# inputs: db (Session), update_game (UpdateGame Pydantic model), game_id (UUID)
# outputs: Updated Game ORM model instance or HTTPException if not found
def update_game_details(db: Session, update_game: UpdateGame,game_id:UUID):
    # Query the database to get the game with the specified game_id
    game = db.execute(
        select(Game).where(Game.id == game_id)
    ).scalar_one_or_none()

    # If no game is found, raise a 404 Not Found HTTP exception
    if not game:
        raise not_found_error()

    # Update the fields of the game instance with the data from the Pydantic model
    update_fields(game, update_game)

    # Commit the changes to the database
    try_commit_db(db, game)

    # Return the updated game instance
    return game

# purpose: Delete a specific game by its ID
# inputs: db (Session), game_id (UUID)
# outputs: "game deleted" message or HTTPException if not found
def delete_game(db: Session, game_id: UUID):
    # Query the database to get the game with the specified game_id
    game = db.execute(
        select(Game).where(Game.id == game_id)
    ).scalar_one_or_none()

    # If no game is found, raise a 404 Not Found HTTP exception
    if not game:
        raise not_found_error()

    # Delete the game instance from the database session
    db.delete(game)
    # Commit the changes to the database
    try_commit_db(db, game)

    # Return a success message indicating the game has been deleted
    return "game deleted"


#Game Participant Services

# purpose: Create a new game participant in the database
# inputs: db (Session), participant (CreateGameParticipant Pydantic model)
# outputs: GameParticipant ORM model instance
def create_game_participant(db: Session, participant: CreateGameParticipant):
    # query the database to check if a GameParticipant already exists for this game and user_id
    exists = db.execute(
        select(GameParticipant).where(
            GameParticipant.game_id == participant.game_id,
            GameParticipant.user_id == participant.user_id
        )
    ).scalar_one_or_none()

    # If a participant already exists, return it
    if exists:
        return exists

    # If no participant exists, create a new GameParticipant instance
    participant_obj = create_model(db, GameParticipant, participant)

    # Add the new participant instance to the database session
    try_commit_db(db, participant_obj)

    # Return the created participant instance
    return participant_obj

# purpose: Create multiple game participants in bulk
# inputs: db (Session), participants (list of CreateGameParticipant Pydantic models)
# outputs: List of GameParticipant ORM model instances
def create_game_participants_bulk(db: Session, participants: list[CreateGameParticipant]):
    #initialize an empty list to hold created participant objects
    created = []

    # Iterate through each participant in the provided list
    for participant in participants:
        # Check if a GameParticipant already exists for this game and user_id
        obj = create_model(db, GameParticipant, participant)
        # add the new participant instance to the database session
        db.add(obj)
        # Append the created participant object to the list
        created.append(obj)
    try:
        # Commit the session to save all participant instances to the database
        db.commit()
        # Refresh each created participant object to reflect the latest state from the database
        for obj in created:
            db.refresh(obj)
    except Exception as e:
        # If an error occurs, rollback the session to revert any changes
        db.rollback()
        # Raise an HTTPException with a 500 status code and the error message
        raise HTTPException(status_code=500, detail=str(e))

    # Return the list of created participant instances
    return created

#purpose: Get all participants for a specific game
# inputs: db (Session), game_id (UUID)
# outputs: List of GameParticipant ORM model instances
def get_game_participants(db: Session, game_id: UUID):
    # Query the database to get all participants for the specified game_id
    participants = db.execute(
        select(GameParticipant)
        .where(GameParticipant.game_id == game_id)
    ).scalars().all()

    # Return ORM objects directly for FastAPI to serialize using the schema
    return participants

# purpose: Get a specific participant for a game by user_id
# inputs: db (Session), game_id (UUID), user_id (UUID)
# outputs: GameParticipant ORM model instance or HTTPException if not found
def delete_participant(db: Session, game_id:UUID,user_id:UUID):
    participant = db.execute(
        select(GameParticipant).where(
            GameParticipant.game_id == game_id,
            GameParticipant.user_id == user_id)
    ).scalar_one_or_none()

    # If no participant is found, raise a 404 Not Found HTTP exception
    if not participant:
        raise not_found_error()

    # Delete the participant instance from the database session
    db.delete(participant)
    # Commit the changes to the database
    try_commit_db(db, participant)

    # Return a success message indicating the participant has been deleted
    return "participant deleted"


#Box Score Services

# purpose: Create multiple box scores in bulk
# inputs: db (Session), box_scores (list of CreateBoxScore Pydantic models)
# outputs: List of BoxScore ORM model instances
def create_box_scores(db: Session, box_scores: List[CreateBoxScore]):
    # create a list of BoxScore ORM model instances from the provided Pydantic models
    objs = [create_model(db, BoxScore, bs) for bs in box_scores]

    # Add all box score instances to the database session
    db.add_all(objs)
    # Commit the session to save all box score instances to the database
    db.commit()
    # Refresh each box score object to reflect the latest state from the database
    for obj in objs:
        db.refresh(obj)
    # Return the list of created box score instances
    return objs

# purpose: Get basic box scores for a specific game
# inputs: db (Session), game_id (UUID)
# outputs: Dictionary containing team and opponent box scores
def get_basic_box_scores(db: Session, game_id: UUID):
    # Get all box scores for the specified game_id, separating team and opponent scores
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    # Get opponent box scores for the specified game_id
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

    # Initialize an empty list to hold team scores
    team_scores = []
    # Iterate through each participant to build the team scores
    for participant in participants:
        # Get the user_id for the participant
        user_id = participant.user_id
        # Look up the box score for the user_id in the box_score_map
        bs = box_score_map.get(str(user_id))
        # If a box score exists for the user_id, calculate the basic box score
        if bs:
            # Append the calculated basic box score to the team_scores list
            team_scores.append(
                ReadBasicBoxScore(
                    user_id=bs.user_id,
                    name=bs.user.name if bs.user else "",
                    **calculate_basic_box_score(bs) # Unpack the calculated stats into the ReadBasicBoxScore schema
                )
            )
        else:
            # Default all stats to 0 if no box score exists
            team_scores.append(
                ReadBasicBoxScore(
                    user_id=user_id,
                    name=participant.user.name if participant.user else "",
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

    # Create opponent scores using the calculated basic box score for the opponent
    opponent_scores = [
        ReadBasicBoxScore(
            user_id=None,
            name="opponent",
            **calculate_basic_box_score(bs) # Unpack the calculated stats into the ReadBasicBoxScore schema
        )
        for bs in opponent_box_scores
    ]

    # Return a dictionary containing team and opponent scores
    return {
        "team": team_scores,
        "opponent": opponent_scores
    }

# purpose: Get shooting box scores for a specific game
# inputs: db (Session), game_id (UUID)
# outputs: Dictionary containing team and opponent shooting box scores
def get_shooting_box_scores(db: Session, game_id: UUID):
    # Get all box scores for the specified game_id, separating team and opponent scores
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    # Get opponent box scores for the specified game_id
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

    # Initialize an empty list to hold team scores
    team_scores = []
    # Iterate through each participant to build the team scores
    for participant in participants:
        # Get the user_id for the participant
        user_id = participant.user_id
        # Look up the box score for the user_id in the box_score_map
        bs = box_score_map.get(str(user_id))
        # If a box score exists for the user_id, calculate the shooting box score
        if bs:
            # Append the calculated shooting box score to the team_scores list
            team_scores.append(
                ReadShootingBoxScore(
                    user_id=bs.user_id,
                    name=bs.user.name if bs.user else "",
                    **calculate_shooting_box_score(bs) # Unpack the calculated stats into the ReadShootingBoxScore schema
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

    # Create opponent scores using the calculated shooting box score for the opponent
    opponent_scores = [
        ReadShootingBoxScore(
            user_id=None,
            name="opponent",
            **calculate_shooting_box_score(bs) # Unpack the calculated stats into the ReadShootingBoxScore schema
        )
        for bs in opponent_box_scores # Calculate shooting box score for each opponent box score
    ]

    # Return a dictionary containing team and opponent scores
    return {
        "team": team_scores,
        "opponent": opponent_scores
    }

# purpose: Get advanced stats for a specific game
# inputs: db (Session), game_id (UUID)
# outputs: Dictionary containing offensive rating, defensive rating, net rating, and pace
def get_team_advanced_stats(db: Session, game_id: UUID):
    # Get all box scores for the specified game_id, separating team and opponent scores
    team_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == False)
    ).scalars().all()

    # Get opponent box scores for the specified game_id
    opponent_box_scores = db.execute(
        select(BoxScore)
        .where(BoxScore.game_id == game_id, BoxScore.is_opponent == True)
    ).scalars().all()

    # calculate total points, possessions, offensive rating, defensive rating, net rating, and pace
    team_pts = calculate_total_points(team_box_scores)
    opp_pts = calculate_total_points(opponent_box_scores)
    team_poss = calculate_total_possessions(team_box_scores)
    opp_poss = calculate_total_possessions(opponent_box_scores)

    off_rtg = calculate_off_rtg(team_pts, team_poss)
    def_rtg = calculate_def_rtg(opp_pts, opp_poss)
    net_rtg = calculate_net_rtg(off_rtg, def_rtg)
    pace = calculate_pace(team_poss, opp_poss)

    # Return a dictionary containing the calculated advanced stats
    return ({
        "off_rtg": off_rtg,
        "def_rtg": def_rtg,
        "net_rtg": net_rtg,
        "pace": pace
    })

# purpose: Update box scores for a specific game
def update_box_score(db: Session, box_scores: List[UpdateBoxScore], game_id: UUID):
    # Check if the game exists
    updated_bs = []

    # Query the database to get the game with the specified game_id
    for bs_update in box_scores:
        # Build the query
        query = select(BoxScore).where(
            BoxScore.game_id == game_id,
            BoxScore.is_opponent == (bs_update.is_opponent or False)
        )

        # Only filter by user_id if it's provided (opponent row won't have user_id)
        if bs_update.user_id:
            query = query.where(BoxScore.user_id == bs_update.user_id)
        if bs_update.team_id:
            query = query.where(BoxScore.team_id == bs_update.team_id)

        # Execute the query to get the box score
        box_score = db.execute(query).scalar_one_or_none()

        # If no box score is found, raise a 404 Not Found HTTP exception
        if not box_score:
            raise not_found_error()

        # Update the fields
        update_fields(box_score, bs_update)
        # Calculate basic box score stats
        updated_bs.append(box_score)

    # Commit all updates at once
    try:
        # Add all updated box scores to the session
        db.commit()
        # Refresh each updated box score to reflect the latest state from the database
        for bs in updated_bs:
            # Calculate basic box score stats
            db.refresh(bs)
    except Exception as e:
        # If an error occurs, rollback the session to revert any changes
        db.rollback()
        # Raise an HTTPException with a 500 status code and the error message
        raise HTTPException(status_code=500, detail=str(e))

    # Return the list of updated box scores
    return updated_bs



# Comment Services

# purpose: Create multiple comments in bulk
# inputs: db (Session), comments (list of CreateComment Pydantic models)
# outputs: List of Comment ORM model instances
def create_comment(db: Session, comments: List[CreateComment]):
    # Check if the comments list is empty
    created_comments = [create_model(db, Comment, comment) for comment in comments]

    # add all comment instances to the database session
    db.add_all(created_comments)
    # Commit the session to save all comment instances to the database
    db.commit()
    # Refresh each comment object to reflect the latest state from the database
    for comment in created_comments:
        db.refresh(comment)

    # Return the list of created comment instances
    return created_comments

# purpose: Get all comments for a specific game
def get_comments(db:Session, game_id: UUID):
    # Query the database to get all comments for the specified game_id
    comments = db.execute(
        select(Comment)
        .where(Comment.game_id == game_id)
    ).scalars().all()

    # If no comments are found, return an empty list
    if not comments:
        return []

    # Return the list of comments
    return comments

# purpose: Update a specific comment by its ID
# inputs: db (Session), update_comment (UpdateComment Pydantic model)
# outputs: Updated Comment ORM model instance or HTTPException if not found
def update_comment(db:Session, update_comment:UpdateComment):
    # Query the database to get the comment with the specified ID
    comment = db.execute(
        select(Comment).where(Comment.id == update_comment.id)
    ).scalar_one_or_none()

    # If no comment is found, raise a 404 Not Found HTTP exception
    if not comment:
        raise not_found_error()

    # Update the fields of the comment instance with the data from the Pydantic model
    update_fields(comment, update_comment)
    # Commit the changes to the database
    try:
        # Add the updated comment instance to the database session
        db.commit()
    except Exception as e:
        # If an error occurs, rollback the session to revert any changes
        db.rollback()
        # Raise an HTTPException with a 500 status code and the error message
        raise HTTPException(status_code=500, detail=str(e))

    # Refresh the comment instance to reflect the latest state from the database
    return comment

#purpose: Delete a specific comment by its ID
# inputs: db (Session), comment_id (UUID)
# outputs: "comment deleted" message or HTTPException if not found
def delete_comment(db:Session, comment_id:UUID):
    # Query the database to get the comment with the specified comment_id
    comment = db.execute(
        select(Comment).where(Comment.id == comment_id)
    ).scalar_one_or_none()

    # If no comment is found, raise a 404 Not Found HTTP exception
    if not comment:
        raise not_found_error()

    # Delete the comment instance from the database session
    db.delete(comment)
    # Commit the changes to the database
    try_commit_db(db,comment)

    # Return a success message indicating the comment has been deleted
    return "comment deleted"

#play by play

# purpose: Create multiple play-by-plays in bulk
# inputs: db (Session), play_by_plays (list of CreatePlayByPlay Pydantic models)
# outputs: List of PlayByPlay ORM model instances
def create_play_by_plays(db:Session,play_by_plays:List[CreatePlayByPlay]):
    # Check if the play_by_plays list is empty
    created_play_by_plays = []
    # Iterate through each play-by-play in the provided list
    for play_by_play in play_by_plays:
        # Create a new PlayByPlay instance using the data from the Pydantic model
        pbp = create_model(db,PlayByPlay,play_by_play)
        # Add the new play-by-play instance to the database session
        created_play_by_plays.append(pbp)
        # Commit the session to save the play-by-play instance to the database
        try_commit_db(db,pbp)

    # Return the list of created play-by-play instances
    return created_play_by_plays

# purpose: Get all play-by-plays for a specific game
# inputs: db (Session), game_id (UUID)
# outputs: List of PlayByPlay ORM model instances or empty list if none found
def get_play_by_plays(db:Session, game_id: UUID):
    # Query the database to get all play-by-plays for the specified game_id
    play_by_plays = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.game_id == game_id)
        .order_by(PlayByPlay.timestamp_seconds.desc()) # Order by timestamp in descending order
    ).scalars().all()

    # If no play-by-plays are found, return an empty list
    return play_by_plays if play_by_plays else []

# purpose: Update a specific play-by-play by its ID
# inputs: db (Session), update_play_by_play (UpdatePlayByPlay Pydantic model)
# outputs: Updated PlayByPlay ORM model instance or HTTPException if not found
def delete_play_by_play(db:Session, play_by_play_id:UUID):
    # Query the database to get the play-by-play with the specified ID
    play_by_play = db.execute(
        select(PlayByPlay)
        .where(PlayByPlay.id == play_by_play_id)
    ).scalar_one_or_none()

    # If no play-by-play is found, raise a 404 Not Found HTTP exception
    if not play_by_play:
        raise not_found_error()

    # Delete the play-by-play instance from the database session
    db.delete(play_by_play)
    try_commit_db(db,play_by_play)

    # Commit the changes to the database
    return "play_by_play deleted"

# Substitution Services

# purpose: Create multiple substitutions in bulk
# inputs: db (Session), new_sub (list of CreateSubs Pydantic models)
# outputs: List of Substitution ORM model instances
def get_subs(db:Session,game_id:UUID):
    # Query the database to get all substitutions for the specified game_id
    subs = db.execute(
        select(Substitution)
        .where(Substitution.game_id == game_id)
    ).scalars().all()

    # If no substitutions are found, return an empty list
    if not subs:
        return []

    # Return the list of substitutions
    return subs

# purpose: Add multiple substitutions in bulk
# inputs: db (Session), new_sub (list of CreateSubs Pydantic models)
# outputs: List of Substitution ORM model instances
def add_subs(db:Session,new_sub:List[CreateSubs]):
    # Check if the new_sub list is empty
    new_subs = []
    # Iterate through each substitution in the provided list
    for sub in new_sub:
        # Create a new Substitution instance using the data from the Pydantic model
        subs = create_model(db,Substitution,sub)
        # Add the new substitution instance to the database session
        try_commit_db(db,subs)
        # Append the created substitution object to the new_subs list
        new_subs.append(subs)

    # Return the list of created substitution instances
    return new_subs

# purpose: Get all players in a specific team
## inputs: db (Session), team_id (UUID)
## outputs: List of dictionaries containing player user_id and name
def get_team_players(db: Session, team_id: UUID):
    # Query the database to get all team memberships for the specified team_id with role "player"
    memberships = db.execute(
        select(TeamMembership)
        .where(TeamMembership.team_id == team_id, TeamMembership.role == "player")
    ).scalars().all()

    # If no memberships are found, raise a 404 Not Found HTTP exception
    if not memberships:
        raise not_found_error()

    # Initialize an empty list to hold player details
    players = []

    # Iterate through each membership to get user details
    for m in memberships:
        # Query the database to get the user associated with the membership
        user = db.execute(select(User).where(User.id == m.user_id)).scalar_one_or_none()
        # If a user is found, append their details to the players list
        if user:
            players.append({"user_id": user.id, "name": user.name})
    if not players:
        # If no players are found, raise a 404 Not Found HTTP exception
        raise not_found_error()

    # return the list of players with their user_id and name
    return players