from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..auth_utils import hash_password
from ..database import get_db
from ..models import User
from ..schemas import (
    UserResponse,
    UserUpdate
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/staffs",
    tags=["Staff Management"]
)


# =========================
# GET ALL STAFFS
# =========================

@router.get(
    "/",
    response_model=list[UserResponse]
)
def get_staffs(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    staffs = db.query(User)\
        .filter(User.is_active == True).all()
    return staffs


# =========================
# GET STAFF BY ID
# =========================

@router.get(
    "/{id}",
    response_model=UserResponse
)
def get_staff(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    staff = (
        db.query(User)
        .filter(User.id == id)
        .first()
    )

    if not staff:
        raise HTTPException(
            status_code=404,
            detail="Staff not found"
        )
    if(staff.is_active==False):
        raise HTTPException(
            status_code=403,
            detail="Staff is in-active, Please contact Administrator"
        )
    return staff


# =========================
# UPDATE STAFF
# =========================

@router.patch(
    "/{id}",
    response_model=UserResponse
)
def update_staff(
    id: int,
    updated_user: UserUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    staff = (
        db.query(User)
        .filter(User.id == id)
        .first()
    )

    if not staff:
        raise HTTPException(
            status_code=404,
            detail="Staff not found"
        )
    if current_user["role"] != "Administrator":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    if updated_user.first_name is not None:
        staff.first_name = updated_user.first_name

    if updated_user.last_name is not None:
        staff.last_name = updated_user.last_name

    if updated_user.email is not None:
        staff.email = updated_user.email

    if updated_user.password is not None:
        staff.hashed_password = hash_password(updated_user.password)

    if updated_user.role is not None:
        staff.role = updated_user.role

    if updated_user.phone is not None:
        staff.phone = updated_user.phone

    if updated_user.address is not None:
        staff.address = updated_user.address

    db.commit()
    db.refresh(staff)

    return staff;


# =========================
# DELETE STAFF
# =========================

@router.delete("/{id}")
def delete_staff(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    staff = (
        db.query(User)
        .filter(User.id == id)
        .first()
    )
    if current_user["role"] != "Administrator":
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )
    if not staff:
        raise HTTPException(
            status_code=404,
            detail="Staff not found"
        )

    staff.is_active= False
    db.commit()

    return {
        "message": "Staff deleted successfully"
    }