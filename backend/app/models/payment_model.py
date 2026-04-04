from sqlalchemy import Column, Integer, String, Enum, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    payment_mode = Column(Enum('UPI', 'card', 'cash'), nullable=False)
    transaction_id = Column(String(100))
    amount = Column(DECIMAL(10,2), nullable=False)
    payment_status = Column(Enum('pending', 'paid', 'failed'), default='pending')
    paid_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    order = relationship("Order", back_populates="payment")