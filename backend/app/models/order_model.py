from sqlalchemy import Column, Integer, Enum, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    table_id = Column(Integer, ForeignKey("tables.table_id"))
    order_type = Column(Enum('dine_in', 'parcel'), nullable=False)
    order_status = Column(Enum('pending', 'preparing', 'ready', 'completed'), default='pending')
    total_amount = Column(DECIMAL(10,2))
    order_time = Column(TIMESTAMP, server_default=func.current_timestamp())

    user = relationship("User")
    table = relationship("DiningTable")
    items = relationship("OrderItem", back_populates="order")
    payment = relationship("Payment", back_populates="order", uselist=False)

class OrderItem(Base):
    __tablename__ = "order_items"

    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"))
    item_id = Column(Integer, ForeignKey("menu.item_id"))
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10,2), nullable=False)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("Menu")