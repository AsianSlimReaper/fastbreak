from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.stats import *
from backend.services import stats_service
from uuid import UUID

router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/individual/{team_id}", response_model=List[IndividualBasicStats])
def get_individual_basic_stats(team_id: UUID, db: Session = Depends(get_db)):
    return stats_service.get_individual_basic_stats(team_id, db)

@router.get("/team/{team_id}", response_model=TeamBasicStats)
def get_team_basic_stats(team_id: UUID, db: Session = Depends(get_db)):
    return stats_service.get_team_basic_stats(team_id, db)

@router.get("/individual/shooting/{team_id}", response_model=List[IndividualShootingStats])
def get_individual_shooting_stats(team_id: UUID, db: Session = Depends(get_db)):
    return stats_service.get_individual_shooting_stats(team_id, db)

@router.get("/team/shooting/{team_id}", response_model=TeamShootingStats)
def get_team_shooting_stats(team_id: UUID, db: Session = Depends(get_db)):
    return stats_service.get_team_shooting_stats(team_id, db)