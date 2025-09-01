# backend/app/models.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    # UUIDs are 36 chars when stored as string
    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_name = Column(String(100), nullable=False)  # reasonable length for names
    user_email = Column(String(255), unique=True, nullable=False)  # safe max for email
    password = Column(String(255), nullable=False)  # enough for hashed pw
    created_on = Column(DateTime, default=datetime.utcnow)
    last_update = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    notes = relationship("Note", back_populates="owner")


class Note(Base):
    __tablename__ = "notes"

    note_id = Column(String(36), primary_key=True, default=generate_uuid)
    note_title = Column(String(255), nullable=False)  # titles usually fit in 255
    note_content = Column(Text, nullable=False)  # good for longer content
    owner_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    created_on = Column(DateTime, default=datetime.utcnow)
    last_update = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="notes")
