import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
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

is_mysql = "mysql" in SQLALCHEMY_DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,       # Never hold idle connections — critical for Clever Cloud's 5-conn limit
    pool_pre_ping=True,       # Drop stale connections before using them
    connect_args={"connect_timeout": 8} if is_mysql else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that yields a DB session and guarantees cleanup.
    NullPool means each request gets a fresh connection that is fully
    closed (not returned to a pool) when the request ends — this keeps
    Clever Cloud's zombie connection count at zero.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()   # With NullPool this physically closes the TCP connection