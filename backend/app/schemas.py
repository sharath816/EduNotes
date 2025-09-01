# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    user_name: str
    user_email: str
    password: str

class UserRead(BaseModel):
    user_id: str
    user_name: str
    user_email: str
    created_on: datetime
    last_update: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    user_email: str
    password: str

# Note Schemas
class NoteCreate(BaseModel):
    note_title: str
    note_content: str

class NoteRead(BaseModel):
    note_id: str
    note_title: str
    note_content: str
    owner_id: str
    created_on: datetime
    last_update: datetime

    class Config:
        from_attributes = True
