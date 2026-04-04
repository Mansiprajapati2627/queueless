from pydantic import BaseModel
from datetime import datetime

class MenuResponse(BaseModel):
    item_id: int
    item_name: str
    description: str | None = None
    price: float
    category: str
    image_url: str | None = None
    availability: bool = True
    created_at: datetime

    class Config:
        from_attributes = True