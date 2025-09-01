# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, crud, auth
from .database import SessionLocal, engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notes App Backend")

# ------------------- CORS -------------------
# CORS settings
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Dependency -------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ------------------- Auth Endpoints -------------------

@app.post("/api/auth/register", response_model=schemas.UserRead)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.user_email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, user)
    return new_user

@app.post("/api/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = auth.authenticate_user(db, user.user_email, user.password)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": db_user.user_id})
    return {"access_token": access_token, "token_type": "bearer"}

# ------------------- Notes Endpoints -------------------
@app.get("/api/notes/", response_model=List[schemas.NoteRead])
def list_notes(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.get_notes(db, owner_id=current_user.user_id)

@app.post("/api/notes/", response_model=schemas.NoteRead)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_note(db, note, owner_id=current_user.user_id)

@app.get("/api/notes/{note_id}", response_model=schemas.NoteRead)
def read_note(note_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_note = crud.get_note(db, note_id, owner_id=current_user.user_id)
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/api/notes/{note_id}", response_model=schemas.NoteRead)
def update_note(note_id: str, note: schemas.NoteCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    updated_note = crud.update_note(db, note_id, owner_id=current_user.user_id, note_data=note)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    deleted_note = crud.delete_note(db, note_id, owner_id=current_user.user_id)
    if not deleted_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted successfully"}
