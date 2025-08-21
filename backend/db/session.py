from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

#load database url and other environment variables from .env file
load_dotenv()

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the SQLAlchemy engine and session factory
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency

#purpose: This function will be used to get a new session for each request
#input: None
#output: a new session object
def get_db():
    #create a new session
    db = SessionLocal()
    try:
        #yield the session to be used in the request
        yield db
    finally:
        #close the session after the request is done
        db.close()
