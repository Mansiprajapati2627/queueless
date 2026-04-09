from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import menu_service
from app.schemas.menu_schema import MenuCreate, MenuResponse, MenuUpdate
from app.utils.auth import get_db, get_current_admin_user
from app.models.user_model import User

router = APIRouter(redirect_slashes=False)

# FIX #1: /admin/all MUST be defined BEFORE /{item_id}
# Otherwise FastAPI matches "admin" as an integer item_id and returns 422
@router.get("/admin/all", response_model=list[MenuResponse])
def read_all_menu_items(
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """Admin-only: returns ALL items including out-of-stock ones."""
    return menu_service.get_menu_items(db, skip=skip, limit=limit, available_only=False)

# FIX #4: Public menu endpoint returns ALL items (available + unavailable)
# so the frontend can show out-of-stock items as greyed out / disabled
@router.get("/", response_model=list[MenuResponse])
def read_menu_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return menu_service.get_menu_items(db, skip=skip, limit=limit, available_only=False)

# /{item_id} must come AFTER all static paths like /admin/all
@router.get("/{item_id}", response_model=MenuResponse)
def read_menu_item(item_id: int, db: Session = Depends(get_db)):
    db_item = menu_service.get_menu_item(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.post("/", response_model=MenuResponse)
def create_menu_item(
    item: MenuCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    return menu_service.create_menu_item(db, item)

@router.put("/{item_id}", response_model=MenuResponse)
def update_menu_item(
    item_id: int,
    item_update: MenuUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    db_item = menu_service.update_menu_item(db, item_id, item_update)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.delete("/{item_id}")
def delete_menu_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    success = menu_service.delete_menu_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}