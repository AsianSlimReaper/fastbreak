from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, User, Team, Game,TeamMembership
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

def get_player_card_data(db:Session, team_id: UUID):

    memberships = db.execute(
        select(TeamMembership).where(
            TeamMembership.team_id == team_id,
        TeamMembership.role == "player")
    ).scalars().all()

    if not memberships:
        return {}

    return memberships

def get_player_profile(db:Session, team_id:UUID, user_id: UUID):
    membership = db.execute(
        select(TeamMembership).where(
            TeamMembership.team_id == team_id,
            TeamMembership.user_id == user_id,
            TeamMembership.role == "player"
        )
    ).scalars().all()

    stats = db.execute(
        select(BoxScore).where(
            BoxScore.team_id == team_id,
            BoxScore.user_id == user_id,
            BoxScore.is_opponent == False
        )
    ).scalars().all()
