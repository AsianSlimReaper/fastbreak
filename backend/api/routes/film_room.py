from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.film_room import *
from backend.services import film_room_service
from uuid import UUID

router = APIRouter(prefix="/film-room", tags=["film-room"])

#game_details:
@router.post("/new-game",response_model=ReadGameDetails)
def new_game(game: CreateGame,db:Session = Depends(get_db)):
    created_game = film_room_service.create_game(db,game)
    return created_game

@router.get("/all-games/{team_id}",response_model=List[ReadGameSummary])
def get_all_games(team_id:UUID,db: Session = Depends(get_db)):
    return film_room_service.get_all_team_games(db,team_id)

@router.get("/game-details/{game_id}",response_model=ReadGameDetails)
def get_game_details(game_id:UUID,db: Session = Depends(get_db)):
    return film_room_service.get_game_details(db,game_id)

@router.patch("/game-details/{game_id}",response_model=ReadGameDetails)
def update_game_details(game_id:UUID,game:UpdateGame,db:Session = Depends(get_db)):
    return film_room_service.update_game_details(db,game,game_id)

@router.delete("/game-details/{game_id}",response_model=str)
def delete_game(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.delete_game(db,game_id)

#game participants
@router.post("/new-participant",response_model=ReadGameParticipant)
def create_new_participant(participant:CreateGameParticipant,db:Session = Depends(get_db)):
    return film_room_service.create_game_participant(db,participant)

@router.post("/new-participants", response_model=list[ReadGameParticipant])
def create_new_participants(participants: list[CreateGameParticipant], db: Session = Depends(get_db)):
    return film_room_service.create_game_participants_bulk(db, participants)

@router.get("/game-participants/{game_id}",response_model=List[ReadGameParticipant])
def get_game_participants(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.get_game_participants(db,game_id)

@router.delete("/game-participants/{game_id}/{user_id}",response_model=str)
def delete_game_participant(game_id:UUID,user_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.delete_participant(db,game_id,user_id)


#Box Score
@router.post("/new-box-scores", response_model=List[ReadBoxScore])
def create_box_scores(box_score:List[CreateBoxScore],db:Session = Depends(get_db)):
    return film_room_service.create_box_scores(db,box_score)

@router.get("/basic-box-scores/{game_id}",response_model=BasicBoxScores)
def get_basic_box_scores(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.get_basic_box_scores(db,game_id)

@router.get("/shooting-box-scores/{game_id}",response_model=ShootingBoxScores)
def get_shooting_box_scores(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.get_shooting_box_scores(db,game_id)

@router.get("/team-advanced-stats/{game_id}", response_model=ReadAdvancedTeamStats)
def get_team_advanced_stats(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.get_team_advanced_stats(db,game_id)

@router.patch("/box-score",response_model=List[ReadBoxScore])
def update_box_score(box_score:List[UpdateBoxScore],db:Session = Depends(get_db)):
    return film_room_service.update_box_score(db,box_score)


#Comment
@router.post("/comments",response_model=List[ReadComment])
def create_comments(comments:List[CreateComment],db:Session = Depends(get_db)):
    return film_room_service.create_comment(db,comments)

@router.get("/comments/{game_id}",response_model=List[ReadComment])
def get_comments(game_id:UUID,db: Session = Depends(get_db)):
    return film_room_service.get_comments(db,game_id)

@router.patch("/comments",response_model=ReadComment)
def update_comment(comment:UpdateComment,db:Session = Depends(get_db)):
    return film_room_service.update_comment(db,comment)

@router.delete("/comments/{comment_id}",response_model=str)
def delete_comment(comment_id: UUID,db: Session = Depends(get_db)):
    return film_room_service.delete_comment(db,comment_id)

#PlayByPlay
@router.post("/play-by-plays",response_model=List[ReadPlayByPlay])
def create_play_by_plays(pbp:List[CreatePlayByPlay],db:Session = Depends(get_db)):
    return film_room_service.create_play_by_plays(db,pbp)

@router.get("/play-by-plays",response_model=List[ReadPlayByPlay])
def get_play_by_plays(game_id:UUID,db: Session = Depends(get_db)):
    return film_room_service.get_play_by_plays(db,game_id)

@router.delete("/play-by-plays/{pbp_id}",response_model=str)
def delete_play_by_play(pbp_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.delete_play_by_play(db, pbp_id)

#subs
@router.post("/subs",response_model=List[ReadSubs])
def add_subs(new_subs:List[CreateSubs],db:Session = Depends(get_db)):
    return film_room_service.add_subs(db,new_subs)

@router.get("/subs/{game_id}",response_model=List[ReadSubs])
def get_subs(game_id:UUID,db:Session = Depends(get_db)):
    return film_room_service.get_subs(db,game_id)

@router.get("/team-players/{team_id}", response_model=List[TeamPlayer])
def get_team_players(team_id: UUID, db: Session = Depends(get_db)):
    return film_room_service.get_team_players(db, team_id)
