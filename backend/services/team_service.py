from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from backend.models.models import Team, TeamMembership
from backend.schemas.team import *
from fastapi import HTTPException
from uuid import UUID
import logging

# Purpose: Create a new team service
#input: db (Session), team (TeamCreate)
#output: new_team (Team)
def create_team_service(db: Session, team: TeamCreate):
    # Check if a team with the same name already exists
    new_team = Team(team_name=team.team_name)

    # create a new team
    db.add(new_team)

    # commit the new team to the database
    db.commit()
    # refresh the new team instance to get the generated ID
    db.refresh(new_team)
    # Log the creation of the new team
    return new_team

# Purpose: Create a new team membership service
# input: db (Session), membership (TeamMembershipCreate)
# output: new_membership (TeamMembership)
def create_team_membership_service(db: Session, membership: TeamMembershipCreate):
    # Check if the team membership already exists
    existing_membership = db.execute(
        select(TeamMembership).where(
            TeamMembership.user_id == membership.user_id,
            TeamMembership.team_id == membership.team_id
        )
    ).scalar_one_or_none()

    # If it exists, raise a conflict error
    if existing_membership:
        raise HTTPException(status_code=409, detail="Team membership already exists")

    # If it doesn't exist, create a new team membership
    new_membership = TeamMembership(
        team_id=membership.team_id,
        user_id=membership.user_id,
        role=membership.role,
        jersey_number=membership.jersey_number,
        position=membership.position,
        archived=membership.archived
    )

    # Add the new membership to the session
    db.add(new_membership)
    # Commit the new membership to the database
    db.commit()
    # Refresh the new membership instance to get the generated ID
    db.refresh(new_membership)
    # return the new membership instance
    return new_membership

# Purpose: Get all teams a user is a member of
# input: db (Session), user_id (UUID)
# output: memberships (List[TeamMembership])
def get_teams_by_user_id(db: Session, user_id: UUID):
    # Fetch all team memberships for the given user_id
    try:
        # Use joinedload to eagerly load the team associated with each membership
        memberships = (
            db.query(TeamMembership)
            .options(joinedload(TeamMembership.team)) # Eagerly load the team
            .filter(TeamMembership.user_id == user_id) # Filter by user_id
            .all()
        )
        # If no memberships found, raise a not found error
        return memberships
    except Exception as error:
        # Log the error and raise an HTTP exception
        logging.exception("Error fetching teams by user_id")
        raise HTTPException(status_code=500, detail=str(error))

# Purpose: Get team by ID
# input: db (Session), team_id (UUID)
# output: team (Team)
def get_team_by_id_service(db: Session, team_id: UUID):
    # Fetch the team by its ID
    team = db.execute(select(Team).where(Team.id == team_id)).scalar_one_or_none()

    # If the team is not found, raise a 404 error
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Return the found team
    return team

# Purpose: Get team membership by ID
# input: db (Session), membership_id (UUID)
# output: membership (TeamMembership)
def get_team_membership_by_id(db: Session, membership_id: UUID):
    # Fetch the team membership by its ID
    membership = db.execute(
        select(TeamMembership).where(TeamMembership.id == membership_id)
    ).scalar_one_or_none()

    # If the membership is not found, raise a 404 error
    if not membership:
        raise HTTPException(status_code=404, detail="Team membership not found")

    # Return the found membership
    return membership

# Purpose: Update team membership service
# input: db (Session), membership_id (UUID), membership (TeamMembershipUpdate)
# output: updated_membership (TeamMembership)
def update_team_membership_service(db: Session, membership_id: UUID, membership: TeamMembershipUpdate):
    # Fetch the existing team membership by its ID
    existing_membership = get_team_membership_by_id(db, membership_id)

    # Update the fields of the existing membership with the new values
    if membership.role:
        existing_membership.role = membership.role
    if membership.jersey_number is not None:
        existing_membership.jersey_number = membership.jersey_number
    if membership.position:
        existing_membership.position = membership.position
    if membership.archived is not None:
        existing_membership.archived = membership.archived

    # Commit the changes to the database
    db.commit()
    # Refresh the existing membership instance to reflect the changes
    db.refresh(existing_membership)
    # Return the updated membership instance
    return existing_membership

# Purpose: Update team service
# input: db (Session), team_id (UUID), team (TeamUpdate)
# output: updated_team (Team)
def update_team_service(db: Session, team_id: UUID, team: TeamUpdate):
    # Fetch the existing team by its ID
    existing_team = db.execute(select(Team).where(Team.id == team_id)).scalar_one_or_none()
    # If the team is not found, raise a 404 error
    if not existing_team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Update the fields of the existing team with the new values
    if team.team_name:
        existing_team.team_name = team.team_name

    # Commit the changes to the database
    db.commit()
    # Refresh the existing team instance to reflect the changes
    db.refresh(existing_team)
    # Return the updated team instance
    return existing_team

