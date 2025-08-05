from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.player_profile import *
from backend.services import player_profile_service
from uuid import UUID

router = APIRouter(prefix="/player-profile", tags=["player-profile"])

@router.get("/player-cards/{team_id}", response_model=list[PlayerSummary])
def get_player_cards(team_id: UUID, db: Session = Depends(get_db)):
    return player_profile_service.get_player_card_data(db, team_id)

@router.get("/player-profile/{team_id}/{user_id}", response_model=PlayerProfile)
def get_player_profile(team_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    return player_profile_service.get_player_profile(db, team_id, user_id)

