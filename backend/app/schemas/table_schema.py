from pydantic import BaseModel

class TableBase(BaseModel):
    table_number: int

class TableCreate(TableBase):
    pass

class TableResponse(TableBase):
    table_id: int

    class Config:
        from_attributes = True