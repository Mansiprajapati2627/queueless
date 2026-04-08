from sqlalchemy.orm import Session
from app.models.menu_model import Menu
from app.schemas.menu_schema import MenuCreate, MenuUpdate

# FIX #3: added available_only param — user menu only fetches available items,
# admin menu fetches all (passes available_only=False)
def get_menu_items(db: Session, skip: int = 0, limit: int = 100, available_only: bool = False):
    query = db.query(Menu)
    if available_only:
        query = query.filter(Menu.availability == True)
    return query.offset(skip).limit(limit).all()

def get_menu_item(db: Session, item_id: int):
    return db.query(Menu).filter(Menu.item_id == item_id).first()

def create_menu_item(db: Session, item: MenuCreate):
    db_item = Menu(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_menu_item(db: Session, item_id: int, item_update: MenuUpdate):
    db_item = db.query(Menu).filter(Menu.item_id == item_id).first()
    if not db_item:
        return None
    update_data = item_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_menu_item(db: Session, item_id: int):
    db_item = db.query(Menu).filter(Menu.item_id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False