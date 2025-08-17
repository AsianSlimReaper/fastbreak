from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.team import *
from backend.services import team_service
from uuid import UUID
from typing import List

router = APIRouter(prefix="/teams", tags=["Teams"])

# Purpose: Create a new team
# Input: team data
# Output: Created team details
@router.post("/", response_model=TeamRead)
def create_team(team_data: TeamCreate, db: Session = Depends(get_db)):
    return team_service.create_team_service(db, team_data)

#Purpose: Update team details
#Input: team_id, team data
##Output: Updated team details
@router.patch("/{team_id}", response_model=TeamRead)
def update_team(team_id: UUID, team_data: TeamUpdate, db: Session = Depends(get_db)):
    return team_service.update_team_service(db, team_id, team_data)

# Purpose: Get all teams of a user
# Input: user_id
# Output: Teams associated with the user
@router.get("/memberships/user/{user_id}", response_model=list[TeamMembershipRead])
def get_teams_by_user(user_id: UUID, db: Session = Depends(get_db)):
    return team_service.get_teams_by_user_id(db, user_id)

# Purpose: Create a new team membership
# Input: team membership data
# Output: Created team membership details
@router.post("/memberships", response_model=TeamMembershipRead)
def create_team_membership(membership_data: TeamMembershipCreate, db: Session = Depends(get_db)):
    return team_service.create_team_membership_service(db, membership_data)

# Purpose: Update team membership details
# Input: membership_id, membership data
# Output: Updated team membership details
@router.patch("/memberships/{membership_id}", response_model=TeamMembershipRead)
def update_team_membership(membership_id: UUID, membership_data: TeamMembershipUpdate, db: Session = Depends(get_db)):
    return team_service.update_team_membership_service(db, membership_id, membership_data)

# Purpose: Get team membership by ID
# Input: membership_id
# Output: Team membership details
@router.get("/memberships/{membership_id}", response_model=TeamMembershipRead)
def get_team_membership(membership_id: UUID, db: Session = Depends(get_db)):
    return team_service.get_team_membership_by_id(db, membership_id)
