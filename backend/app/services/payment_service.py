from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from app.models.payment_model import Payment
from app.schemas.payment_schema import PaymentCreate, PaymentUpdateStatus
import time
import logging

logger = logging.getLogger(__name__)

def _retry_db(fn, retries=2, delay=1.5):
    """Retry a DB operation on connection errors (Clever Cloud 5-conn limit)."""
    last_err = None
    for i in range(retries + 1):
        try:
            return fn()
        except OperationalError as e:
            last_err = e
            if i < retries:
                logger.warning(f"DB connection error (attempt {i+1}), retrying in {delay}s: {e}")
                time.sleep(delay)
    raise last_err

def create_payment(db: Session, payment: PaymentCreate):
    def _do():
        db_payment = Payment(**payment.model_dump())
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        return db_payment
    return _retry_db(_do)

def get_payment(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.payment_id == payment_id).first()

def update_payment_status(db: Session, payment_id: int, status_update: PaymentUpdateStatus):
    db_payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if not db_payment:
        return None
    db_payment.payment_status = status_update.payment_status
    db.commit()
    db.refresh(db_payment)
    return db_payment