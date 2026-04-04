import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool

# Load .env file explicitly
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise Exception("DATABASE_URL environment variable not set")

# Create engine with connection pool limits to stay within free MySQL plan (max 5 connections)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=QueuePool,
    pool_size=2,           # persistent connections in the pool
    max_overflow=2,        # extra connections allowed beyond pool_size
    pool_timeout=30,       # seconds to wait for a connection from pool
    pool_recycle=1800,     # recycle connections every 30 minutes
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()