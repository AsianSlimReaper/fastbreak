from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.user import UserCreate, UserRead, UserUpdate, UserLogin
from backend.models.models  import User
from backend.services import user_service
from uuid import UUID

#Create router for user-related endpoints
router = APIRouter(prefix="/users", tags=["Users"])

#purpose: create a new user
#input: user data
#output: created user details
@router.post("/", response_model=UserRead)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return user_service.create_user_service(db, user_data)

#purpose: login user and return access token
#input: username and password
#output: access token
@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    user_login = UserLogin(email=form_data.username, password=form_data.password)
    token_response = user_service.login_for_access_token(db, user_login)
    return token_response

#purpose: get current user details
#input: current user from token
#output: current user details
@router.get("/me")
def read_users_me(current_user: User = Depends(user_service.get_current_user)):
    return current_user

#purpose: update user details
#input: user_id, user data
#output: updated user details
@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: UUID, user_data: UserUpdate, db: Session = Depends(get_db)):
    return user_service.update_user_service(db, user_id, user_data)

#purpose:get user details by email
#input: user_email
#output: user details
@router.get("/by-email/{user_email}", response_model=UserRead)
def get_user_by_email(user_email: str, db: Session = Depends(get_db)):
    return user_service.get_user_by_email(db, user_email)

#purpose: get user details by user_id
#input: user_id
#output: user details
@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(db, user_id)

