from sqlalchemy.orm import Session
from app.models.table_model import DiningTable
from app.schemas.table_schema import TableCreate

def get_table(db: Session, table_id: int):
    return db.query(DiningTable).filter(DiningTable.table_id == table_id).first()

def get_table_by_number(db: Session, table_number: int):
    return db.query(DiningTable).filter(DiningTable.table_number == table_number).first()

def get_tables(db: Session, skip: int = 0, limit: int = 100):
    return db.query(DiningTable).offset(skip).limit(limit).all()

def create_table(db: Session, table: TableCreate):
    db_table = DiningTable(table_number=table.table_number)
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

def delete_table(db: Session, table_id: int):
    db_table = db.query(DiningTable).filter(DiningTable.table_id == table_id).first()
    if db_table:
        db.delete(db_table)
        db.commit()
        return True
    return False