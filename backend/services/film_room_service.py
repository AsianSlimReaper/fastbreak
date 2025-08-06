from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.models.models import BoxScore, Game, Team, User, GameParticipant, PlayByPlay, Comment
from fastapi import HTTPException
from uuid import UUID
from backend.utils.stat_calculations import *
from collections import defaultdict

def create_new_game(db:Session, team_id:UUID):
    pass