from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Patient
from ..schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/patients",
    tags=["Patient Management"]
)


# =========================
# CREATE PATIENT
# =========================

@router.post(
    "/",
    response_model=PatientResponse
)
def create_patient(
    patient: PatientCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_patient = Patient(
        first_name=patient.first_name,
        last_name=patient.last_name,
        dob=patient.dob,
        gender=patient.gender,
        phone=patient.phone,
        email=patient.email,
        address=patient.address,
        blood_group=patient.blood_group
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# =========================
# GET ALL PATIENTS
# =========================

@router.get(
    "/",
    response_model=list[PatientResponse]
)
def get_patients(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).all()
    return patients


# =========================
# GET PATIENT BY ID
# =========================

@router.get(
    "/{id}",
    response_model=PatientResponse
)
def get_patient(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# =========================
# UPDATE PATIENT
# =========================

@router.patch(
    "/{id}",
    response_model=PatientResponse
)
def update_patient(
    id: int,
    updated_patient: PatientUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    if updated_patient.first_name is not None:
        patient.first_name = updated_patient.first_name

    if updated_patient.last_name is not None:
        patient.last_name = updated_patient.last_name

    if updated_patient.dob is not None:
        patient.dob = updated_patient.dob

    if updated_patient.gender is not None:
        patient.gender = updated_patient.gender

    if updated_patient.phone is not None:
        patient.phone = updated_patient.phone

    if updated_patient.email is not None:
        patient.email = updated_patient.email

    if updated_patient.address is not None:
        patient.address = updated_patient.address

    if updated_patient.blood_group is not None:
        patient.blood_group = updated_patient.blood_group

    db.commit()
    db.refresh(patient)

    return patient


# =========================
# DELETE PATIENT
# =========================

@router.delete("/{id}")
def delete_patient(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return {
        "message": "Patient deleted successfully"
    }

# search patient by phone number
@router.get("/search/{phone}")
def search_patient(
    phone: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Patient)
        .filter(
            Patient.phone.ilike(f"%{phone}%")
        )
        .all()
    )