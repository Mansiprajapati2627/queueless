from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal
from datetime import datetime


# ── Item schemas ─────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int
    price: float


class OrderItemResponse(BaseModel):
    order_item_id: int
    item_id: int
    quantity: int
    price: Decimal
    item_name: Optional[str] = None

    class Config:
        from_attributes = True


# ── Order schemas ─────────────────────────────────────────────

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
    total_amount: Optional[Decimal] = None
    order_status: str
    # FIX: order_time was missing — frontend was receiving null for every order
    # causing all date filters, charts, and "Invalid Date" display to fail
    order_time: Optional[datetime] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True