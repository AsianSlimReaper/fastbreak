from pydantic import BaseModel
from typing import List,Optional
from uuid import UUID
from datetime import date

class NewGame(BaseModel):
    team_id: UUID
    date:date
    opponent:str
    video_url:str

    model_config = {
        "from_attributes": True
    }


class NewGameParticipant(BaseModel):
    game_id: UUID
    user_id: UUID

    model_config = {
        "from_attributes": True
    }


class NewBoxScore(BaseModel):
    game_id:UUID
    user_id:UUID
    team_id:UUID

    is_opponent:bool

    mins: float
    ast:int
    oreb:int
    dreb:int
    stl:int
    blk:int
    tov:int
    fls:int
    twopm:int
    twopa:int
    threepm:int
    threepa:int
    ftm:int
    fta:int
    plus_minus:int

    model_config = {
        "from_attributes": True
    }


class NewComment(BaseModel):
    game_id:UUID
    user_id:UUID
    timestamp_seconds:int
    comment_text:str

    model_config = {
        "from_attributes": True
    }


class NewPlayByPlay(BaseModel):
    game_id:UUID
    user_id:UUID
    timestamp_seconds:int
    event_type:str
    description:str

    model_config = {
        "from_attributes": True
    }

class ParticipantRead(BaseModel):
    user_id: UUID
    user_name: str

    model_config = {
        "from_attributes": True
    }

class GameRead(BaseModel):
    id: UUID
    team_id: UUID
    opponent: str
    date: date
    video_url: str

class BasicBoxScoreRead(BaseModel):
    mins:float
    pts:int
    ast:int
    reb:int
    oreb:int
    dreb:int
    stl:int
    blk:int
    tov:int
    fls:int
    plus_minus:int
    efficiency:int

    model_config = {
        "from_attributes": True
    }

class ShootingBoxScoreRead(BaseModel):
    fga:int
    fgm:int
    fg_pct:float
    three_pm:int
    three_pa:int
    threep_pct:float
    ftm:int
    fta:int
    ft_pct:float
    efg_pct:float
    ts_pct:float

    model_config = {
        "from_attributes": True
    }

class TeamAdvancedStatsRead(BaseModel):
    off_rtg:float
    def_rtg:float
    pace:float

    model_config = {
        "from_attributes": True
    }

class CommentRead(BaseModel):
    game_id:UUID
    timestamp_seconds:int
    comment_text:str

    model_config = {
        "from_attributes": True
    }

class PlayByPlay(BaseModel):
    game_id:UUID
    user_id:UUID
    timestamp_seconds:int
    event_type:str
    description:str

    model_config = {
        "from_attributes": True
    }

class UpdateGame(BaseModel):
    team_id: UUID
    date: Optional[date]
    opponent: Optional[str]
    video_url: Optional[str]

    model_config = {
        "from_attributes": True
    }

class UpdateBoxScore(BaseModel):
    id:UUID
    game_id:UUID
    user_id:Optional[UUID]
    team_id:Optional[UUID]

    is_opponent: Optional[bool]

    mins:Optional[float]
    ast:Optional[int]
    oreb:Optional[int]
    dreb:Optional[int]
    stl:Optional[int]
    blk:Optional[int]
    tov:Optional[int]
    fls:Optional[int]
    twopm:Optional[int]
    twopa:Optional[int]
    threepm:Optional[int]
    threepa:Optional[int]
    ftm:Optional[int]
    fta:Optional[int]
    plus_minus:Optional[int]

    model_config = {
        "from_attributes": True
    }

class UpdateComment(BaseModel):
    id:UUID
    game_id:UUID
    timestamp_seconds:Optional[int]
    comment_text:Optional[str]

    model_config = {
        "from_attributes": True
    }
