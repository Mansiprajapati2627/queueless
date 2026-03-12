from sqlalchemy import Column, Integer
from app.config.database import Base

class DiningTable(Base):
    __tablename__ = "tables"

    table_id = Column(Integer, primary_key=True, index=True)
    table_number = Column(Integer, unique=True, nullable=False)