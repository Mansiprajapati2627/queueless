from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, TIMESTAMP
from sqlalchemy.sql import func
from app.config.database import Base

class Menu(Base):
    __tablename__ = "menu"

    item_id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(DECIMAL(10,2), nullable=False)
    image_url = Column(String(255))
    availability = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())