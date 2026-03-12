from pydantic import BaseModel
from datetime import datetime

class PaymentBase(BaseModel):
    order_id: int
    payment_mode: str
    transaction_id: str | None = None
    amount: float

class PaymentCreate(PaymentBase):
    pass

class PaymentUpdateStatus(BaseModel):
    payment_status: str

class PaymentResponse(PaymentBase):
    payment_id: int
    payment_status: str
    paid_at: datetime

    class Config:
        from_attributes = True