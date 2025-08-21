from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.stats import *
from backend.services import stats_service
from uuid import UUID

# Define stats routes
router = APIRouter(prefix="/stats", tags=["stats"])

# Purpose: to get individual basic stats for a specific team
# Inputs: team_id (UUID) to identify the team
# Outputs: List of IndividualBasicStats containing basic stats for each player in the team
# Justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/individual/{team_id}", response_model=List[IndividualBasicStats])
def get_individual_basic_stats(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch individual basic stats for the specified team
    return stats_service.get_individual_basic_stats(team_id, db)

# Purpose: to get team basic stats for a specific team
# Inputs: team_id (UUID) to identify the team
# Outputs: TeamBasicStats containing basic stats for the team
# Justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/team/{team_id}", response_model=TeamBasicStats)
def get_team_basic_stats(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch team basic stats for the specified team
    return stats_service.get_team_basic_stats(team_id, db)

# Purpose: to get individual advanced stats for a specific team
# Inputs: team_id (UUID) to identify the team
# Outputs: List of IndividualAdvancedStats containing advanced stats for each player in the team
# Justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/individual/shooting/{team_id}", response_model=List[IndividualShootingStats])
def get_individual_shooting_stats(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch individual shooting stats for the specified team
    return stats_service.get_individual_shooting_stats(team_id, db)

# Purpose: to get team shooting stats for a specific team
# Inputs: team_id (UUID) to identify the team
# Outputs: TeamShootingStats containing shooting stats for the team
# Justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/team/shooting/{team_id}", response_model=TeamShootingStats)
def get_team_shooting_stats(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch team shooting stats for the specified team
    return stats_service.get_team_shooting_stats(team_id, db)