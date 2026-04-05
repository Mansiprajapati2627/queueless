import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
import logging

logger = logging.getLogger(__name__)

env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    logger.error("DATABASE_URL not set — using SQLite fallback")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./fallback.db"

# Use NullPool — creates a fresh connection per request and closes it immediately
# after the request finishes. This is the only safe option for Clever Cloud's
# 5-connection limit: QueuePool holds connections open between requests, which
# causes "QueuePool limit reached" errors under any concurrent load.
# NullPool never holds idle connections, so we stay well under the limit.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,
    pool_pre_ping=True,   # verify connection is alive before using it
    connect_args={
        "connect_timeout": 10,   # fail fast if DB is unreachable
    } if "mysql" in SQLALCHEMY_DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()