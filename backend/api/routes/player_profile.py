from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.player_profile import *
from backend.services import player_profile_service
from uuid import UUID

#define player profile routes
router = APIRouter(prefix="/player-profile", tags=["player-profile"])


# purpose: to get player cards for a specific team
# inputs: team_id (UUID) to identify the team
# outputs: List of PlayerSummary containing player card data for the team
## justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/player-cards/{team_id}", response_model=list[PlayerSummary])
def get_player_cards(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch player card data for the specified team
    return player_profile_service.get_player_card_data(db, team_id)

# purpose: to get the player profile for a specific user in a team
# inputs: team_id (UUID) to identify the team, user_id (UUID) to identify the player
# outputs: PlayerProfile schema containing detailed player profile information
## justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/player-profile/{team_id}/{user_id}", response_model=PlayerProfile)
def get_player_profile(team_id: UUID, user_id: UUID, db: Session = Depends(get_db)):
    # Fetch the player profile for the specified user in the team
    return player_profile_service.get_player_profile(db, team_id, user_id)

