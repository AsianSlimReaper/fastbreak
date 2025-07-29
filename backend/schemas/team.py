from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class TeamCreate(BaseModel):
    team_name: str

    model_config = {
        "from_attributes": True
    }

class TeamMembershipCreate(BaseModel):
    team_id: UUID
    user_id: UUID
    role: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    archived: Optional[bool] = False

    model_config = {
        "from_attributes": True
    }

class TeamRead(BaseModel):
    id: UUID
    team_name: str

    model_config = {
        "from_attributes": True
    }

class TeamMembershipRead(BaseModel):
    id: UUID
    team_id: UUID
    user_id: UUID
    role: str
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    archived: Optional[bool] = False
    team: Optional[TeamRead]

    model_config = {
        "from_attributes": True
    }

class TeamMembershipUpdate(BaseModel):
    role: Optional[str] = None
    jersey_number: Optional[int] = None
    position: Optional[str] = None
    archived: Optional[bool] = None

    model_config = {
        "from_attributes": True
    }

class TeamUpdate(BaseModel):
    team_name: Optional[str] = None

    model_config = {
        "from_attributes": True
    }
