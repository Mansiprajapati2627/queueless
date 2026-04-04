from sqlalchemy.orm import Session, joinedload
from app.models.order_model import Order, OrderItem
from app.schemas.order_schema import OrderCreate, OrderUpdateStatus

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).offset(skip).limit(limit).all()
    for order in orders:
        for item in order.items:
            item.item_name = item.menu_item.item_name if item.menu_item else f"Item {item.item_id}"
    return orders

def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    for order in orders:
        for item in order.items:
            item.item_name = item.menu_item.item_name if item.menu_item else f"Item {item.item_id}"
    return orders

def get_order(db: Session, order_id: int):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).filter(Order.order_id == order_id).first()
    if order:
        for item in order.items:
            item.item_name = item.menu_item.item_name if item.menu_item else f"Item {item.item_id}"
    return order

def create_order(db: Session, order: OrderCreate):
    db_order = Order(
        user_id=order.user_id,
        table_id=order.table_id,
        order_type=order.order_type,
        total_amount=order.total_amount
    )
    db.add(db_order)
    db.flush()
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.order_id,
            item_id=item.item_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status_update: OrderUpdateStatus):
    db_order = db.query(Order).filter(Order.order_id == order_id).first()
    if not db_order:
        return None
    db_order.order_status = status_update.order_status
    db.commit()
    db.refresh(db_order)
    return db_order