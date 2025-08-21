from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.dashboard import *
from backend.services import dashboard_service
from uuid import UUID

# define dashboard routes
router = APIRouter(prefix="/dashboard", tags=["dashboard"])

#define the route to get the player dashboard with parameters user_id and team_id
#purpose: to get the player dashboard with team stats, individual stats, and recent games
#inputs: user_id (UUID), team_id (UUID)
#outputs: PlayerDashboard schema containing team stats, individual stats, and recent games
#justifcation: UUID to ensure unique identification, Session to interact with the database
@router.get("/dashboard/player/{user_id}/{team_id}", response_model=PlayerDashboard)
def get_player_dashboard(user_id: UUID,team_id:UUID, db: Session = Depends(get_db)):
    # Fetch team stats, individual stats, and recent games for the player
    team_stats = dashboard_service.get_dashboard_team_stats(team_id, db)
    individual_stats = dashboard_service.get_dashboard_player_individual_stats(user_id,team_id, db)
    recent_games = dashboard_service.get_player_recent_games(user_id,team_id, db)

    # Return the dashboard data in a dictionary
    return({
        "team_stats": team_stats,
        "individual_stats": individual_stats,
        "recent_games": recent_games
    })

# define the route to get the coach dashboard with parameters team_id
# purpose: to get the coach dashboard with team stats, individual stats, and recent games
# inputs: team_id (UUID)
# outputs: CoachDashboard schema containing team stats, individual stats, and recent games
# justification: UUID to ensure unique identification, Session to interact with the database
@router.get("/dashboard/coach/{team_id}", response_model=CoachDashboard)
def get_coach_dashboard(team_id: UUID, db: Session = Depends(get_db)):
    # Fetch team stats, individual stats, and recent games for the coach
    team_stats = dashboard_service.get_dashboard_team_stats(team_id, db)
    individual_stats = dashboard_service.get_dashboard_all_individual_stats(team_id, db)
    recent_games = dashboard_service.get_team_recent_games(team_id, db)

    # Return the dashboard data in a dictionary
    return ({
        "team_stats": team_stats,
        "individual_stats": individual_stats,
        "recent_games": recent_games
    })
