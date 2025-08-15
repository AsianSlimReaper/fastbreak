from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from backend.models.models import Team, TeamMembership
from backend.schemas.team import *
from fastapi import HTTPException
from uuid import UUID

import logging

# Purpose: Create a new team service
def create_team_service(db: Session, team: TeamCreate):
    new_team = Team(team_name=team.team_name)
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

# Purpose: Create a new team membership service
def create_team_membership_service(db: Session, membership: TeamMembershipCreate):
    existing_membership = db.execute(
        select(TeamMembership).where(
            TeamMembership.user_id == membership.user_id,
            TeamMembership.team_id == membership.team_id
        )
    ).scalar_one_or_none()

    if existing_membership:
        raise HTTPException(status_code=409, detail="Team membership already exists")

    new_membership = TeamMembership(
        team_id=membership.team_id,
        user_id=membership.user_id,
        role=membership.role,
        jersey_number=membership.jersey_number,
        position=membership.position,
        archived=membership.archived
    )

    db.add(new_membership)
    db.commit()
    db.refresh(new_membership)
    return new_membership

# Purpose: Get all teams a user is a member of
def get_teams_by_user_id(db: Session, user_id: UUID):
    try:
        memberships = (
            db.query(TeamMembership)
            .options(joinedload(TeamMembership.team))
            .filter(TeamMembership.user_id == user_id)
            .all()
        )
        return memberships
    except Exception as error:
        logging.exception("Error fetching teams by user_id")
        raise HTTPException(status_code=500, detail=str(error))

# Purpose: Get team by ID
def get_team_by_id_service(db: Session, team_id: UUID):
    team = db.execute(select(Team).where(Team.id == team_id)).scalar_one_or_none()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

# Purpose: Get team membership by ID
def get_team_membership_by_id(db: Session, membership_id: UUID):
    membership = db.execute(
        select(TeamMembership).where(TeamMembership.id == membership_id)
    ).scalar_one_or_none()

    if not membership:
        raise HTTPException(status_code=404, detail="Team membership not found")
    return membership

# Purpose: Update team membership service
def update_team_membership_service(db: Session, membership_id: UUID, membership: TeamMembershipUpdate):
    existing_membership = get_team_membership_by_id(db, membership_id)

    if membership.role:
        existing_membership.role = membership.role
    if membership.jersey_number is not None:
        existing_membership.jersey_number = membership.jersey_number
    if membership.position:
        existing_membership.position = membership.position
    if membership.archived is not None:
        existing_membership.archived = membership.archived

    db.commit()
    db.refresh(existing_membership)
    return existing_membership

# Purpose: Update team service
def update_team_service(db: Session, team_id: UUID, team: TeamUpdate):
    existing_team = db.execute(select(Team).where(Team.id == team_id)).scalar_one_or_none()
    if not existing_team:
        raise HTTPException(status_code=404, detail="Team not found")

    if team.team_name:
        existing_team.team_name = team.team_name

    db.commit()
    db.refresh(existing_team)
    return existing_team

def get_players_by_team_id(db:Session, team_id: UUID):
    players = db.execute(
        select(TeamMembership)
        .where(TeamMembership.team_id == team_id,
               TeamMembership.role == "player")
    ).scalars().all()
    if not players:
        raise HTTPException(status_code=404, detail="players not found")

    return players