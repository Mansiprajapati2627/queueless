from pydantic import BaseModel
from datetime import datetime

class MenuBase(BaseModel):
    item_name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    availability: bool = True

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    item_name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    availability: bool | None = None

class MenuResponse(MenuBase):
    item_id: int
    created_at: datetime

    class Config:
        from_attributes = True