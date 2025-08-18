import uuid
from datetime import date
from sqlalchemy import (
    String, Text, Integer, ForeignKey, UniqueConstraint, Boolean, Date,Index, Float, ARRAY
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, DeclarativeBase
from sqlalchemy.dialects.postgresql import UUID
from typing import List


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    password: Mapped[str] = mapped_column(Text, nullable=False)

    memberships = relationship("TeamMembership", back_populates="user")
    box_scores = relationship("BoxScore", back_populates="user")
    play_by_plays = relationship("PlayByPlay", back_populates="user")
    game_participations = relationship("GameParticipant", back_populates="user")


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_name: Mapped[str] = mapped_column(String, nullable=False)

    memberships = relationship("TeamMembership", back_populates="team")
    games = relationship("Game", back_populates="team")


class TeamMembership(Base):
    __tablename__ = "team_memberships"
    __table_args__ = (
        UniqueConstraint('user_id', 'team_id', name='unique_user_team_membership'),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('teams.id'), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)
    jersey_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    position: Mapped[str | None] = mapped_column(String, nullable=True)
    archived: Mapped[bool] = mapped_column(Boolean, default=False)

    team = relationship("Team", back_populates="memberships")
    user = relationship("User", back_populates="memberships")


class Game(Base):
    __tablename__ = "games"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    team_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('teams.id'), nullable=False)
    opponent: Mapped[str] = mapped_column(String, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)

    team = relationship("Team", back_populates="games")
    box_scores = relationship("BoxScore", back_populates="game", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="game", cascade="all, delete-orphan")
    participants = relationship("GameParticipant", back_populates="game", cascade="all, delete-orphan")
    play_by_plays = relationship("PlayByPlay", back_populates="game", cascade="all, delete-orphan")
    substitutions = relationship("Substitution", back_populates="game", cascade="all, delete-orphan")


class GameParticipant(Base):
    __tablename__ = "game_participants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('games.id'), nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)

    game = relationship("Game", back_populates="participants")
    user = relationship("User", back_populates="game_participations")


class BoxScore(Base):
    __tablename__ = "box_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('games.id'), nullable=False)
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    team_id:Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey('teams.id'), nullable=True)

    is_opponent: Mapped[bool] = mapped_column(Boolean, default=False)

    ast: Mapped[int] = mapped_column(Integer, default=0)
    oreb: Mapped[int] = mapped_column(Integer, default=0)
    dreb: Mapped[int] = mapped_column(Integer, default=0)
    stl: Mapped[int] = mapped_column(Integer, default=0)
    blk: Mapped[int] = mapped_column(Integer, default=0)
    tov: Mapped[int] = mapped_column(Integer, default=0)
    fls: Mapped[int] = mapped_column(Integer, default=0)
    twopm: Mapped[int] = mapped_column(Integer, default=0)
    twopa: Mapped[int] = mapped_column(Integer, default=0)
    threepm: Mapped[int] = mapped_column(Integer, default=0)
    threepa: Mapped[int] = mapped_column(Integer, default=0)
    ftm: Mapped[int] = mapped_column(Integer, default=0)
    fta: Mapped[int] = mapped_column(Integer, default=0)
    plus_minus: Mapped[int] = mapped_column(Integer, default=0)

    game = relationship("Game", back_populates="box_scores")
    user = relationship("User", back_populates="box_scores")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('games.id'), nullable=False)
    timestamp_seconds: Mapped[int] = mapped_column(Integer)
    comment_text: Mapped[str] = mapped_column(Text)

    game = relationship("Game", back_populates="comments")


class PlayByPlay(Base):
    __tablename__ = "play_by_play"

    __table_args__ = (
        Index("ix_play_by_play_game_time", "game_id", "timestamp_seconds"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('games.id'), nullable=False,index=True)
    timestamp_seconds: Mapped[int] = mapped_column(Integer)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    is_opponent: Mapped[bool] = mapped_column(Boolean, default=False)
    event_type: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text)

    game = relationship("Game", back_populates="play_by_plays")
    user = relationship("User", back_populates="play_by_plays")

class Substitution(Base):
    __tablename__ = "substitutions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    game_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey('games.id'), nullable=False,index=True)
    timestamp_seconds:Mapped[int] = mapped_column(Integer)
    on_court: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)

    game = relationship("Game", back_populates="substitutions")



