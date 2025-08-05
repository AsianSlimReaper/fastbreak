from typing import Literal
from pydantic import BaseModel
from uuid import UUID
from datetime import date

class PlayerSummary(BaseModel):
    user_name: str
    user_id: UUID
    team_id: UUID
    jersey_number: int | None = None
    position: str | None = None

    model_config = {
        "from_attributes": True
    }

class PlayerProfileStats(BaseModel):
    mins:float
    ppg: float
    apg: float
    rpg: float
    spg: float
    bpg: float
    fg_pct: float
    threep_pct: float
    ft_pct: float
    ts_pct: float
    efg_pct: float
    tov: float
    plus_minus: float

    model_config = {
        "from_attributes": True
    }

class PlayerProfileRecentGames(BaseModel):
    opponent: str
    date: date
    team_score: int
    opponent_score: int
    result: Literal['win', 'loss', 'draw']

    model_config = {
        "from_attributes": True
    }
    
class PlayerProfile(BaseModel):
    player: PlayerSummary
    stats: PlayerProfileStats
    recent_games: list[PlayerProfileRecentGames]

    model_config = {
        "from_attributes": True
    }
    