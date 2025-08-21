from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.film_room import *
from backend.services import film_room_service
from uuid import UUID

# define film room routes
router = APIRouter(prefix="/film-room", tags=["film-room"])

#game_details:

# purpose: to create a new game in the film room
# inputs: CreateGame schema containing game details
# outputs: ReadGameDetails schema containing the created game details
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/new-game",response_model=ReadGameDetails)
def new_game(game: CreateGame,db:Session = Depends(get_db)):
    # Create a new game in the film room
    created_game = film_room_service.create_game(db,game)

    # Return the created game details
    return created_game

#purpose: to get all games for a specific team
# inputs: team_id (UUID) to identify the team
# outputs: List of ReadGameSummary containing summaries of all games for the team
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/all-games/{team_id}",response_model=List[ReadGameSummary])
def get_all_games(team_id:UUID,db: Session = Depends(get_db)):
    # Fetch all games for the specified team
    return film_room_service.get_all_team_games(db,team_id)

#purpose: to get details of a specific game
# inputs: game_id (UUID) to identify the game
# outputs: ReadGameDetails schema containing details of the specified game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/game-details/{game_id}",response_model=ReadGameDetails)
def get_game_details(game_id:UUID,db: Session = Depends(get_db)):
    # Fetch details of the specified game
    return film_room_service.get_game_details(db,game_id)


#purpose: to update details of a specific game
# inputs: game_id (UUID) to identify the game, UpdateGame schema containing updated game details
# outputs: ReadGameDetails schema containing the updated game details
# justification: UUID to ensure unique identification, Session to interact with the database
@router.patch("/game-details/{game_id}",response_model=ReadGameDetails)
def update_game_details(game_id:UUID,game:UpdateGame,db:Session = Depends(get_db)):
    # Update details of the specified game
    return film_room_service.update_game_details(db,game,game_id)

#purpose: to delete a specific game
# inputs: game_id (UUID) to identify the game
# outputs: string message indicating successful deletion
# justification: UUID to ensure unique identification, Session to interact with the database
@router.delete("/game-details/{game_id}",response_model=str)
def delete_game(game_id:UUID,db:Session = Depends(get_db)):
    # Delete the specified game
    return film_room_service.delete_game(db,game_id)

#game participants

# purpose: to create a new game participant
# inputs: CreateGameParticipant schema containing participant details
# outputs: ReadGameParticipant schema containing the created participant details
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/new-participant",response_model=ReadGameParticipant)
def create_new_participant(participant:CreateGameParticipant,db:Session = Depends(get_db)):
    # Create a new game participant
    return film_room_service.create_game_participant(db,participant)

# purpose: to create multiple new game participants in bulk
# inputs: List of CreateGameParticipant schemas containing participant details
# outputs: List of ReadGameParticipant schemas containing the created participant details
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/new-participants", response_model=list[ReadGameParticipant])
def create_new_participants(participants: list[CreateGameParticipant], db: Session = Depends(get_db)):
    # Create multiple game participants in bulk
    return film_room_service.create_game_participants_bulk(db, participants)

# purpose: to get all participants for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: List of ReadGameParticipant schemas containing details of all participants for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/game-participants/{game_id}",response_model=List[ReadGameParticipant])
def get_game_participants(game_id:UUID,db:Session = Depends(get_db)):
    # Fetch all participants for the specified game
    return film_room_service.get_game_participants(db,game_id)

# purpose: to delete a specific game participant
# inputs: game_id (UUID) to identify the game, user_id (UUID) to identify the participant
# outputs: string message indicating successful deletion
# justification: UUID to ensure unique identification, Session to interact with the database
@router.delete("/game-participants/{game_id}/{user_id}",response_model=str)
def delete_game_participant(game_id:UUID,user_id:UUID,db:Session = Depends(get_db)):
    # Delete the specified game participant
    return film_room_service.delete_participant(db,game_id,user_id)


#Box Score
# purpose: to create new box scores for a game
# inputs: List of CreateBoxScore schemas containing box score details
# outputs: List of ReadBoxScore schemas containing the created box scores
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/new-box-scores", response_model=List[ReadBoxScore])
def create_box_scores(box_score:List[CreateBoxScore],db:Session = Depends(get_db)):
    # Create new box scores for a game
    return film_room_service.create_box_scores(db,box_score)

# purpose: to get basic box scores for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: BasicBoxScores schema containing basic box scores for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/basic-box-scores/{game_id}",response_model=BasicBoxScores)
def get_basic_box_scores(game_id:UUID,db:Session = Depends(get_db)):
    # Fetch basic box scores for the specified game
    return film_room_service.get_basic_box_scores(db,game_id)

# purpose: to get shooting box scores for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: ShootingBoxScores schema containing shooting box scores for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/shooting-box-scores/{game_id}",response_model=ShootingBoxScores)
def get_shooting_box_scores(game_id:UUID,db:Session = Depends(get_db)):
    # Fetch shooting box scores for the specified game
    return film_room_service.get_shooting_box_scores(db,game_id)

# purpose: to get advanced box scores for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: AdvancedBoxScores schema containing advanced box scores for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/team-advanced-stats/{game_id}", response_model=ReadAdvancedTeamStats)
def get_team_advanced_stats(game_id:UUID,db:Session = Depends(get_db)):
    # Fetch advanced box scores for the specified game
    return film_room_service.get_team_advanced_stats(db,game_id)

# purpose: to update box scores for a specific game
# inputs: game_id (UUID) to identify the game, List of UpdateBoxScore schemas containing updated box score details
# outputs: List of ReadBoxScore schemas containing the updated box scores
# justification: UUID to ensure unique identification, Session to interact with the database
@router.patch("/box-score/{game_id}",response_model=List[ReadBoxScore])
def update_box_score(game_id:UUID,box_score:List[UpdateBoxScore],db:Session = Depends(get_db)):
    # Update box scores for the specified game
    return film_room_service.update_box_score(db,box_score,game_id)


#Comment

# purpose: to create multiple comments for a game
# inputs: List of CreateComment schemas containing comment details
# outputs: List of ReadComment schemas containing the created comments
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/comments",response_model=List[ReadComment])
def create_comments(comments:List[CreateComment],db:Session = Depends(get_db)):
    # Create multiple comments for a game
    return film_room_service.create_comment(db,comments)

# purpose: to get all comments for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: List of ReadComment schemas containing all comments for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/comments/{game_id}",response_model=List[ReadComment])
def get_comments(game_id:UUID,db: Session = Depends(get_db)):
    # Fetch all comments for the specified game
    return film_room_service.get_comments(db,game_id)

# purpose: to update a specific comment
# inputs: UpdateComment schema containing updated comment details
# outputs: ReadComment schema containing the updated comment details
# justification: UUID to ensure unique identification, Session to interact with the database
@router.patch("/comments",response_model=ReadComment)
def update_comment(comment:UpdateComment,db:Session = Depends(get_db)):
    # Update the specified comment
    return film_room_service.update_comment(db,comment)

# purpose: to delete a specific comment
# inputs: comment_id (UUID) to identify the comment
# outputs: string message indicating successful deletion
# justification: UUID to ensure unique identification, Session to interact with the database
@router.delete("/comments/{comment_id}",response_model=str)
def delete_comment(comment_id: UUID,db: Session = Depends(get_db)):
    # Delete the specified comment
    return film_room_service.delete_comment(db,comment_id)

#PlayByPlay

# purpose: to create multiple play-by-plays for a game
# inputs: List of CreatePlayByPlay schemas containing play-by-play details
# outputs: List of ReadPlayByPlay schemas containing the created play-by-plays
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/play-by-plays",response_model=List[ReadPlayByPlay])
def create_play_by_plays(pbp:List[CreatePlayByPlay],db:Session = Depends(get_db)):
    # Create multiple play-by-plays for a game
    return film_room_service.create_play_by_plays(db,pbp)

# purpose: to get all play-by-plays for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: List of ReadPlayByPlay schemas containing all play-by-plays for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/play-by-plays",response_model=List[ReadPlayByPlay])
def get_play_by_plays(game_id:UUID,db: Session = Depends(get_db)):
    # Fetch all play-by-plays for the specified game
    return film_room_service.get_play_by_plays(db,game_id)

# purpose: to delete a specific play-by-play
# inputs: pbp_id (UUID) to identify the play-by-play
# outputs: string message indicating successful deletion
# justification: UUID to ensure unique identification, Session to interact with the database
@router.delete("/play-by-plays/{pbp_id}",response_model=str)
def delete_play_by_play(pbp_id:UUID,db:Session = Depends(get_db)):
    # Delete the specified play-by-play
    return film_room_service.delete_play_by_play(db, pbp_id)

#subs

# purpose: to create multiple substitutions for a game
# inputs: List of CreateSubs schemas containing substitution details
# outputs: List of ReadSubs schemas containing the created substitutions
# justification: UUID to ensure unique identification, Session to interact with the database
@router.post("/subs",response_model=List[ReadSubs])
def add_subs(new_subs:List[CreateSubs],db:Session = Depends(get_db)):
    # Create multiple substitutions for a game
    return film_room_service.add_subs(db,new_subs)

# purpose: to get all substitutions for a specific game
# inputs: game_id (UUID) to identify the game
# outputs: List of ReadSubs schemas containing all substitutions for the game
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/subs/{game_id}",response_model=List[ReadSubs])
def get_subs(game_id:UUID,db:Session = Depends(get_db)):
    # Fetch all substitutions for the specified game
    return film_room_service.get_subs(db,game_id)

#purpose to get all players in a team
# inputs: team_id (UUID) to identify the team
# outputs: List of TeamPlayer schemas containing all players in the team
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/team-players/{team_id}", response_model=List[TeamPlayer])
def get_team_players(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch all players in the specified team
    return film_room_service.get_team_players(db, team_id)