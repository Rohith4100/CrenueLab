from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth_utils import verify_password
from ..database import get_db
from ..models import User
from ..schemas import UserSignup, UserLogin
from ..auth_utils import create_access_token, hash_password, verify_password

router = APIRouter(tags=["Authentication"])

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
# def hash_password(password: str):
#     return pwd_context.hash(password)
# def verify_password(
#     plain_password: str,
#     hashed_password: str
# ):
#     return pwd_context.verify(
#         plain_password,
#         hashed_password
#     )


@router.post("/signup")
def signup(
    user: UserSignup,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
        phone=user.phone,
        address=user.address
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "id": db_user.id,
            "email": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "role": db_user.role,
        "user": {
            "id": db_user.id,
            "first_name": db_user.first_name,
            "last_name": db_user.last_name,
            "email": db_user.email
        }
    }