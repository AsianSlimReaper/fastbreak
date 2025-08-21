import os
from jose import jwt, JWTError
from datetime import datetime, timedelta, UTC
from fastapi import HTTPException, status
from backend.models.models import User
from sqlalchemy.orm import Session
from uuid import UUID
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM', 'HS256')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# purpose: create access token
# input: data (dict) - data to encode in the token
# output: str - encoded JWT token
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    # If no expiration is provided, default to 24 hours
    to_encode = data.copy()
    # Set the expiration time for the token
    expire = datetime.now(UTC) + (expires_delta or timedelta(hours=24))
    # Add the expiration time to the token data
    to_encode.update({"exp": expire})
    # Encode the token with the secret key and algorithm
    # Return the encoded JWT token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# purpose: verify access token
# input: db (Session) - database session
#output: User - user object if token is valid, raises HTTPException if invalid
def verify_access_token(db: Session, token: str):
    # initialize credentials_exception for unauthorized access
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Extract the user ID from the token payload
        user_id: str = payload.get("sub")
        # If user_id is not found in the payload, raise credentials_exception
        if user_id is None:
            raise credentials_exception
    except JWTError:
        # If there is an error decoding the token, raise credentials_exception
        raise credentials_exception

    # Query the database for the user with the given user_id
    user = db.query(User).filter(User.id == UUID(user_id)).first()
    # If user is not found, raise credentials_exception
    if user is None:
        raise credentials_exception

    # Return the user object if everything is valid
    return user