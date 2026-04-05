from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PaymentBase(BaseModel):
    order_id: int
    payment_mode: str  # keep as str — DB enum is 'UPI'/'card'/'cash'
    transaction_id: Optional[str] = None
    amount: float


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdateStatus(BaseModel):
    payment_status: str


class PaymentResponse(PaymentBase):
    payment_id: int
    payment_status: str
    # FIX: paid_at can be None immediately after INSERT before DB sets
    # the server_default timestamp — making it Optional prevents
    # ValidationError → 500 → fake CORS error on POST /payments/
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True