from pydantic import BaseModel
from typing import List, Literal, Optional
from uuid import UUID
from datetime import date


class Base(BaseModel):
    model_config = {
        "from_attributes": True
    }


#Game Schemas
class CreateGame(Base):
    team_id: UUID
    opponent: str
    date: date
    participants: Optional[List[UUID]] = None


class ReadGameDetails(Base):
    id: UUID
    team_id: UUID
    opponent: str
    date: date


class ReadGameSummary(Base):
    game_id:UUID
    date: date
    opponent: str
    team_score: int
    opponent_score: int
    result: Literal["win", "loss", "draw"]


class UpdateGame(Base):
    opponent: Optional[str]
    date: Optional[date]


#Game Participant Schemas
class CreateGameParticipant(Base):
    game_id: UUID
    user_id: UUID


class ReadGameParticipant(Base):
    game_id: UUID
    user_id: UUID


#Box Score Schemas
class CreateBoxScore(Base):
    game_id: UUID
    user_id: Optional[UUID]
    team_id: Optional[UUID]
    is_opponent: Optional[bool]
    mins: float
    ast: int
    oreb: int
    dreb: int
    stl: int
    blk: int
    tov: int
    fls: int
    twopm: int
    twopa: int
    threepm: int
    threepa: int
    ftm: int
    fta: int
    plus_minus: int

class ReadBoxScore(CreateBoxScore):
    id:UUID


class ReadBasicBoxScore(Base):
    user_id: Optional[UUID]
    name: str
    mins: float
    pts: int
    ast: int
    reb: int
    oreb: int
    dreb: int
    stl: int
    blk: int
    tov: int
    fls: int
    eff: int
    plus_minus: int


class ReadShootingBoxScore(Base):
    user_id: Optional[UUID]
    name: str
    fgm: int
    fga: int
    fg_pct: float
    threepm: int
    threepa: int
    threep_pct: float
    ftm: int
    fta: int
    ft_pct: float
    efg_pct: float
    ts_pct: float


class BasicBoxScores(Base):
    team: List[ReadBasicBoxScore]
    opponent: List[ReadBasicBoxScore]


class ShootingBoxScores(Base):
    team: List[ReadShootingBoxScore]
    opponent: List[ReadShootingBoxScore]


class ReadAdvancedTeamStats(Base):
    off_rtg: float
    def_rtg: float
    pace: float


class UpdateBoxScore(Base):
    id: UUID
    user_id: Optional[UUID]
    team_id: Optional[UUID]
    is_opponent: Optional[bool]
    mins: Optional[float]
    ast: Optional[int]
    oreb: Optional[int]
    dreb: Optional[int]
    stl: Optional[int]
    blk: Optional[int]
    tov: Optional[int]
    fls: Optional[int]
    twopm: Optional[int]
    twopa: Optional[int]
    threepm: Optional[int]
    threepa: Optional[int]
    ftm: Optional[int]
    fta: Optional[int]
    plus_minus: Optional[int]


#comment

class CreateComment(Base):
    game_id: UUID
    timestamp_seconds: int
    comment_text: str


class ReadComment(Base):
    game_id: UUID
    timestamp_seconds: int
    comment_text: str


class UpdateComment(Base):
    id:UUID
    game_id: UUID
    timestamp_seconds: Optional[int]
    comment_text: Optional[str]


#play by play
class CreatePlayByPlay(Base):
    game_id: UUID
    user_id: UUID
    timestamp_seconds: int
    is_opponent: bool
    event_type: str
    description: str


class ReadPlayByPlay(Base):
    game_id: UUID
    user_id: UUID
    timestamp_seconds: int
    is_opponent: bool
    event_type: str
    description: str

#subs
class CreateSubs(Base):
    game_id:UUID
    timestamp_seconds: int
    on_court:List[str]

class ReadSubs(Base):
    id:UUID
    game_id: UUID
    timestamp_seconds: int
    on_court: List[str]

# Team Player Schema for selection
class TeamPlayer(Base):
    user_id: UUID
    name: str
