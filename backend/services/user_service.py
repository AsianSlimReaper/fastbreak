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

# purpose: This module provides services for user management, including creating, retrieving, and updating users.
# input: UserCreate, UserUpdate, UserLogin schemas
# output: User model instances or HTTP exceptions
def create_user_service(db: Session, user: UserCreate):
    # Check if the user already exists
    email = normalize_email(user.email)
    # Normalize the email to ensure case insensitivity and consistency
    existing_user = db.query(User).filter(User.email == email).first()

    # If the user already exists, raise an HTTP exception
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    # Create a new user instance with the normalized email and hashed password
    new_user = User(
        email=email,
        name=user.name,
        password=hash_password(user.password)
    )
    # Add the new user to the database session, commit the session, and refresh the user instance
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Return the newly created user instance
    return new_user

# purpose: This function retrieves a user by their ID from the database.
## input: db (Session), user_id (UUID)
## output: User model instance or HTTP exception if not found
def get_user_by_id(db: Session, user_id: UUID):
    # Retrieve the user by ID from the database
    user = db.query(User).filter(User.id == user_id).first()
    # If the user is not found, raise an HTTP exception with a 404 status code
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the user instance
    return user

# purpose: This function retrieves a user by their email from the database.
# input: db (Session), user_email (str)
# output: User model instance or HTTP exception if not found
def get_user_by_email(db: Session, user_email: str):
    # Normalize the email to ensure case insensitivity and consistency
    email = normalize_email(user_email)
    # Retrieve the user by email from the database
    user = db.query(User).filter(User.email == email).first()
    # If the user is not found, raise an HTTP exception with a 404 status code
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Return the user instance
    return user

# create an OAuth2PasswordBearer instance for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# purpose: This function retrieves the current user based on the provided token.
# input: db (Session), token (str)
# output: User model instance or HTTP exception if token is invalid
def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme) # OAuth2PasswordBearer instance to extract the token from the request
):
    # Verify the access token and retrieve the user ID from it
    return verify_access_token(db, token)

# purpose: This function logs in a user and returns an access token.
# input: db (Session), user_login (UserLogin schema)
# output: Dictionary containing the access token and token type
def login_for_access_token(db: Session, user_login: UserLogin):
    # Normalize the email to ensure case insensitivity and consistency
    email = normalize_email(user_login.email)
    # Retrieve the user by email from the database
    user = db.query(User).filter(User.email == email).first()
    # If the user is not found or the password is incorrect, raise an HTTP exception
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Verify the provided password against the stored hashed password
    if not verify_password(user_login.password, user.password):
        # If the password is incorrect, raise an HTTP exception with a 401 status code
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Create an access token for the user with a 24-hour expiration time
    access_token = create_access_token(
        data={"sub": str(user.id)}, # 'sub' is the subject claim, typically the user ID
        expires_delta=timedelta(hours=24) # Set the token expiration time to 24 hours
    )
    # Return a dictionary containing the access token and its type
    return {"access_token": access_token, "token_type": "bearer"}

# purpose: This function updates a user's information in the database.
def update_user_service(db: Session, user_id: UUID, user_update: UserUpdate):
    # Retrieve the user by ID from the database
    user = get_user_by_id(db, user_id)

    # Check if the user is trying to update their email
    if user_update.email:
        # Normalize the email to ensure case insensitivity and consistency
        email = normalize_email(user_update.email)
        # Check if the email already exists in the database
        existing_user = db.query(User).filter(User.email == email).first()
        # If the email exists and belongs to a different user, raise an HTTP exception
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=409, detail="Email already in use")
        # Update the user's email with the normalized email
        user.email = email

    # Update the user's name and password if provided
    if user_update.name:
        user.name = user_update.name

    # If a new password is provided, hash it before storing
    if user_update.password:
        user.password = hash_password(user_update.password)

    # Add the updated user to the database session, commit the session, and refresh the user instance
    db.commit()
    db.refresh(user)

    # Return the updated user instance
    return user