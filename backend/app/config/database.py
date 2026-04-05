import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import logging

logger = logging.getLogger(__name__)

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    logger.error("DATABASE_URL not set — using SQLite fallback")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./fallback.db"

# FIX: Clever Cloud free MySQL = max 5 simultaneous connections.
# Previously used NullPool which creates a NEW connection on every request
# and never closes old ones fast enough — exhausting the 5-connection limit.
# Now use QueuePool capped at 3 connections (leaving 2 spare for admin/other).
# pool_recycle=280 closes idle connections before Clever Cloud's 300s timeout.
# pool_pre_ping=True drops stale connections before using them.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=QueuePool,
    pool_size=2,           # max 2 persistent connections
    max_overflow=1,        # allow 1 extra burst connection = 3 total max
    pool_timeout=30,       # wait up to 30s for a connection before erroring
    pool_recycle=280,      # recycle connections after 280s (before CC's 300s timeout)
    pool_pre_ping=True,    # test connection health before using it
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()