from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.dashboard import *
from backend.services import dashboard_service
from uuid import UUID

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/dashboard/player/{user_id}/{team_id}", response_model=PlayerDashboard)
def get_player_dashboard(user_id: UUID,team_id:UUID, db: Session = Depends(get_db)):
    team_stats = dashboard_service.get_dashboard_team_stats(team_id, db)
    individual_stats = dashboard_service.get_dashboard_player_individual_stats(user_id,team_id, db)
    recent_games = dashboard_service.get_player_recent_games(user_id, db)

    return({
        "team_stats": team_stats,
        "individual_stats": individual_stats,
        "recent_games": recent_games
    })

@router.get("/dashboard/coach/{team_id}", response_model=CoachDashboard)
def get_coach_dashboard(team_id: UUID, db: Session = Depends(get_db)):
    team_stats = dashboard_service.get_dashboard_team_stats(team_id, db)
    individual_stats = dashboard_service.get_dashboard_all_individual_stats(team_id, db)
    recent_games = dashboard_service.get_team_recent_games(team_id, db)

    return ({
        "team_stats": team_stats,
        "individual_stats": individual_stats,
        "recent_games": recent_games
    })
