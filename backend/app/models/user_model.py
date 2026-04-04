from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.config.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum('admin', 'user'), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())