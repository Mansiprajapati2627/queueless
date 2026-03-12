from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import order_service
from app.schemas.order_schema import OrderCreate, OrderResponse, OrderUpdateStatus
from app.utils.auth import get_db, get_current_active_user, get_current_admin_user
from app.models.user_model import User
router = APIRouter()

@router.post("/", response_model=OrderResponse)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Optionally associate order with current user
    order.user_id = current_user.user_id
    return order_service.create_order(db, order)

@router.get("/", response_model=list[OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # If admin, get all orders; else only user's orders
    if current_user.role == "admin":
        orders = order_service.get_orders(db, skip=skip, limit=limit)
    else:
        # Need a method to get orders by user_id – implement if needed
        orders = order_service.get_orders(db, skip=skip, limit=limit)
        # Filter manually (inefficient for large data, but okay for demo)
        orders = [o for o in orders if o.user_id == current_user.user_id]
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_order = order_service.get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Check permissions
    if current_user.role != "admin" and db_order.user_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return db_order

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderUpdateStatus,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),  # admin only
):
    db_order = order_service.update_order_status(db, order_id, status_update)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order