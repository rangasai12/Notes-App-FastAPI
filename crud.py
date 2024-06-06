from sqlalchemy.orm import Session
from models import User, Note
from schemas import UserCreate, NoteCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if user and pwd_context.verify(password, user.hashed_password):
        return user
    return None

def get_notes(db: Session, owner_id: int, skip: int = 0, limit: int = 10):
    return db.query(Note).filter(Note.owner_id == owner_id).offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int, owner_id: int):
    return db.query(Note).filter(Note.id == note_id, Note.owner_id == owner_id).first()

def create_note(db: Session, note: NoteCreate, owner_id: int):
    db_note = Note(**note.dict(), owner_id=owner_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, note_id: int, note: NoteCreate, owner_id: int):
    db_note = get_note(db, note_id, owner_id)
    if db_note:
        db_note.title = note.title
        db_note.content = note.content
        db.commit()
        db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: int, owner_id: int):
    db_note = get_note(db, note_id, owner_id)
    if db_note:
        db.delete(db_note)
        db.commit()
    return db_note
