from pydantic import BaseModel
from typing import List, Literal, Optional
from uuid import UUID
from datetime import date

# please read init.py for more information about the schemas
class DashboardBase(BaseModel):
    model_config = {
        "from_attributes": True
    }


class DashboardTeamStats(DashboardBase):
    wins: int
    draws: int
    losses: int
    off_rtg: float
    def_rtg: float
    net_rtg: float


class DashboardPlayerStats(DashboardBase):
    name: Optional[str] = None
    ppg: float
    apg: float
    rpg: float
    spg: float
    bpg: float


class DashboardRecentGame(DashboardBase):
    game_id: Optional[UUID] = None
    date: date
    opponent: str
    team_score: int
    opponent_score: int
    result: Literal["win", "loss", "draw"]


class PlayerDashboard(DashboardBase):
    team_stats: DashboardTeamStats
    individual_stats: DashboardPlayerStats
    recent_games: List[DashboardRecentGame]


class CoachDashboard(DashboardBase):
    team_stats: DashboardTeamStats
    individual_stats: List[DashboardPlayerStats]
    recent_games: List[DashboardRecentGame]
