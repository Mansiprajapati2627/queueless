from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MenuBase(BaseModel):
    item_name: str
    description: Optional[str] = None
    price: float
    category: str
    image_url: Optional[str] = None
    availability: bool = True

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    item_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    availability: Optional[bool] = None

class MenuResponse(MenuBase):
    item_id: int
    created_at: datetime

    class Config:
        from_attributes = True