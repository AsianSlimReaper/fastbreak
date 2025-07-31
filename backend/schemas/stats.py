from pydantic import BaseModel
from uuid import UUID

class IndividualBasicStats(BaseModel):
    user_id: UUID
    user_name: str
    mins: float
    ppg: float
    apg: float
    orpg: float
    drpg: float
    rpg: float
    spg: float
    bpg: float
    tpg: float
    fpg: float
    plus_minus: float
    efficiency: float

    model_config = {
        "from_attributes": True
    }

class TeamBasicStats(BaseModel):
    wins: int
    losses: int
    draws: int
    point_for: int
    point_against: int
    ast:float
    oreb: float
    dreb: float
    reb: float
    stl: float
    blk: float
    tov: float
    fls: float
    off_rtg: float
    def_rtg: float
    net_rtg: float
    pace: float

    model_config = {
        "from_attributes": True
    }

class IndividualShootingStats(BaseModel):
    user_id: UUID
    user_name: str
    fgm: float
    fga: float
    fg_pct: float
    twopm: float
    twopa: float
    twop_pct: float
    threepm: float
    threepa: float
    three_pct: float
    ftm: float
    fta: float
    ft_pct: float
    efg_pct: float
    ts_pct: float

    model_config = {
        "from_attributes": True
    }

class TeamShootingStats(BaseModel):
    fgm: float
    fga: float
    fg_pct: float
    twopm: float
    twopa: float
    twop_pct: float
    threepm: float
    threepa: float
    three_pct: float
    ftm: float
    fta: float
    ft_pct: float
    efg_pct: float
    ts_pct: float

    model_config = {
        "from_attributes": True
    }