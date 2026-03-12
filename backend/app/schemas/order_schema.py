from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class OrderItemBase(BaseModel):
    item_id: int
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemResponse(OrderItemBase):
    order_item_id: int
    order_id: int

class OrderBase(BaseModel):
    user_id: Optional[int] = None
    table_id: Optional[int] = None
    order_type: str
    total_amount: Optional[float] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdateStatus(BaseModel):
    order_status: str

class OrderResponse(OrderBase):
    order_id: int
    order_status: str
    order_time: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True