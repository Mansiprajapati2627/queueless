import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import logging

logger = logging.getLogger(__name__)

env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# FIX: Previously raised Exception immediately if DATABASE_URL was missing.
# That crashed the entire process at import time — before FastAPI even created
# the app object — so CORS middleware never registered and every browser request
# got ERR_FAILED with no Access-Control-Allow-Origin header.
# Now we log a warning and create a placeholder; the real error surfaces
# only when a request actually tries to use the DB.
if not SQLALCHEMY_DATABASE_URL:
    logger.error(
        "DATABASE_URL environment variable is not set! "
        "Set it in Render → Environment Variables. "
        "DB operations will fail but the server will still start."
    )
    # Use a dummy SQLite URL so engine creation doesn't crash at import.
    # All DB calls will still fail cleanly with a 500 — but CORS headers
    # will be present on those 500s, which is far better than a dead server.
    SQLALCHEMY_DATABASE_URL = "sqlite:///./fallback.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()