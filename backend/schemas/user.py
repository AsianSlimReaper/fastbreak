from pydantic import BaseModel
import uuid
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    model_config = {
        "from_attributes": True
    }

class UserRead(UserCreate):
    id: uuid.UUID

    model_config = {
        "from_attributes": True
    }

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

    model_config = {
        "from_attributes": True
    }

class UserLogin(BaseModel):
    email: str
    password: str

    model_config = {
        "from_attributes": True
    }