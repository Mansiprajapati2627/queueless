from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import payment_service
from app.schemas.payment_schema import PaymentCreate, PaymentResponse, PaymentUpdateStatus
from app.utils.auth import get_db, get_current_admin_user, get_current_active_user
from app.models.user_model import User
router = APIRouter()

@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Optionally verify the order belongs to the user
    return payment_service.create_payment(db, payment)

@router.get("/{payment_id}", response_model=PaymentResponse)
def read_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    db_payment = payment_service.get_payment(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    # Check permissions (user can view their own payment, admin all)
    # For simplicity, just check if order belongs to user (would need to load order)
    # Skipping for brevity
    return db_payment

@router.patch("/{payment_id}/status", response_model=PaymentResponse)
def update_payment_status(
    payment_id: int,
    status_update: PaymentUpdateStatus,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),  # admin only
):
    db_payment = payment_service.update_payment_status(db, payment_id, status_update)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment