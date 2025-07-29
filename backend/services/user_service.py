from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.models import User
from backend.schemas.user import *
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from uuid import UUID
from datetime import timedelta
from backend.utils.security import hash_password, verify_password, normalize_email
from backend.utils.jwt_utils import create_access_token,verify_access_token


def create_user_service(db: Session, user: UserCreate):
    email = normalize_email(user.email)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    new_user = User(
        email=email,
        name=user.name,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user_by_id(db: Session, user_id: UUID):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_user_by_email(db: Session, user_email: str):
    email = normalize_email(user_email)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    return verify_access_token(db, token)

def login_for_access_token(db: Session, user_login: UserLogin):
    email = normalize_email(user_login.email)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user_login.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(hours=24)
    )
    return {"access_token": access_token, "token_type": "bearer"}

def update_user_service(db: Session, user_id: UUID, user_update: UserUpdate):
    user = get_user_by_id(db, user_id)

    if user_update.email:
        email = normalize_email(user_update.email)
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=409, detail="Email already in use")
        user.email = email

    if user_update.name:
        user.name = user_update.name

    if user_update.password:
        user.password = hash_password(user_update.password)

    db.commit()
    db.refresh(user)
    return user
