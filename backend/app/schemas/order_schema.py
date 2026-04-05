from pydantic import BaseModel
from typing import List, Optional
from decimal import Decimal


# ── Item schemas ────────────────────────────────────────────

class OrderItemCreate(BaseModel):
    item_id: int
    quantity: int
    price: float


class OrderItemResponse(BaseModel):
    order_item_id: int
    item_id: int
    quantity: int
    price: Decimal
    # FIX: item_name is set dynamically in order_service.py via
    #   item.item_name = item.menu_item.item_name
    # Without this field in the schema, Pydantic raises ValidationError
    # on every order response → 500 → browser shows fake CORS error
    item_name: Optional[str] = None

    class Config:
        from_attributes = True


# ── Order schemas ────────────────────────────────────────────

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
    # FIX: items was completely missing — every GET /orders/ and POST /orders/
    # call returned a ValidationError because the ORM object had .items
    # but the schema had nowhere to put them
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True