from sqlalchemy.orm import Session, joinedload
from app.models.order_model import Order, OrderItem
from app.schemas.order_schema import OrderCreate, OrderUpdateStatus
from datetime import timezone


def _normalize_order(order: Order) -> Order:
    """
    Attach item_name to each OrderItem and ensure order_time is timezone-aware
    so it serializes as a proper ISO-8601 string with 'Z' suffix in JSON.
    """
    for item in order.items:
        item.item_name = item.menu_item.item_name if item.menu_item else f"Item {item.item_id}"

    # If order_time has no tzinfo (naive datetime from DB), treat it as UTC
    if order.order_time is not None and order.order_time.tzinfo is None:
        order.order_time = order.order_time.replace(tzinfo=timezone.utc)

    return order


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).offset(skip).limit(limit).all()
    return [_normalize_order(o) for o in orders]


def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    orders = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).filter(Order.user_id == user_id).offset(skip).limit(limit).all()
    return [_normalize_order(o) for o in orders]


def get_order(db: Session, order_id: int):
    order = db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.menu_item)
    ).filter(Order.order_id == order_id).first()
    if order:
        _normalize_order(order)
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