from pydantic import BaseModel
from typing import List, Optional

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    user_id: Optional[int] = None
    table_id: Optional[int] = None
    order_type: str
    total_amount: Optional[float] = None
    items: List[OrderItemCreate]

class OrderUpdateStatus(BaseModel):
    order_status: str

class OrderResponse(BaseModel):
    order_id: int
    user_id: Optional[int] = None
    table_id: Optional[int] = None
    order_type: str
    total_amount: Optional[float] = None
    order_status: str

    class Config:
        from_attributes = True