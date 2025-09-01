# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------- User operations -------------------
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        user_name=user.user_name,
        user_email=user.user_email,
        password=hashed_password,
        created_on=datetime.utcnow(),
        last_update=datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.user_email == email).first()

def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

# ------------------- Note operations -------------------
def create_note(db: Session, note: schemas.NoteCreate, owner_id: str):
    db_note = models.Note(
        note_title=note.note_title,
        note_content=note.note_content,
        owner_id=owner_id,
        created_on=datetime.utcnow(),
        last_update=datetime.utcnow()
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def get_notes(db: Session, owner_id: str):
    return db.query(models.Note).filter(models.Note.owner_id == owner_id).all()

def get_note(db: Session, note_id: str, owner_id: str):
    return db.query(models.Note).filter(
        models.Note.note_id == note_id,
        models.Note.owner_id == owner_id
    ).first()

def update_note(db: Session, note_id: str, owner_id: str, note_data: schemas.NoteCreate):
    note = get_note(db, note_id, owner_id)
    if note:
        note.note_title = note_data.note_title
        note.note_content = note_data.note_content
        note.last_update = datetime.utcnow()   # update timestamp
        db.commit()
        db.refresh(note)
    return note

def delete_note(db: Session, note_id: str, owner_id: str):
    note = get_note(db, note_id, owner_id)
    if note:
        db.delete(note)
        db.commit()
    return note
