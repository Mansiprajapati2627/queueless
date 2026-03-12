from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import table_service
from app.schemas.table_schema import TableCreate, TableResponse
from app.utils.auth import get_db, get_current_admin_user
from app.models.user_model import User
router = APIRouter()

@router.post("/", response_model=TableResponse)
def create_table(
    table: TableCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    existing = table_service.get_table_by_number(db, table.table_number)
    if existing:
        raise HTTPException(status_code=400, detail="Table number already exists")
    return table_service.create_table(db, table)

@router.get("/", response_model=list[TableResponse])
def read_tables(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    tables = table_service.get_tables(db, skip=skip, limit=limit)
    return tables

@router.get("/{table_id}", response_model=TableResponse)
def read_table(
    table_id: int,
    db: Session = Depends(get_db),
):
    db_table = table_service.get_table(db, table_id)
    if not db_table:
        raise HTTPException(status_code=404, detail="Table not found")
    return db_table

@router.delete("/{table_id}")
def delete_table(
    table_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    success = table_service.delete_table(db, table_id)
    if not success:
        raise HTTPException(status_code=404, detail="Table not found")
    return {"message": "Table deleted successfully"}