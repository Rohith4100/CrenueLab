from __future__ import annotations
from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, field_validator
from app.models.user import (
    UserRole, Gender, OrderStatus, OrderPriority,
    SpecimenStatus, ResultStatus, TestCategory
)


# ── Auth ───────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str


# ── User ───────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole
    phone: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: UserRole
    phone: Optional[str]
    is_active: bool
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Patient ────────────────────────────────────────────────────────────────

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    dob: date
    gender: Gender
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    insurance_group_number: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    referring_physician: Optional[str] = None


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[Gender] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    insurance_group_number: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    referring_physician: Optional[str] = None


class PatientOut(BaseModel):
    id: int
    patient_id: str
    first_name: str
    last_name: str
    dob: date
    gender: Gender
    phone: Optional[str]
    email: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    insurance_provider: Optional[str]
    insurance_policy_number: Optional[str]
    insurance_group_number: Optional[str]
    medical_history: Optional[str]
    allergies: Optional[str]
    referring_physician: Optional[str]
    is_active: bool
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Test Catalog ───────────────────────────────────────────────────────────

class TestCatalogCreate(BaseModel):
    code: str
    name: str
    category: TestCategory
    description: Optional[str] = None
    sample_type: Optional[str] = None
    turnaround_hours: int = 24
    price: float = 0.0
    reference_ranges: Optional[Any] = None


class TestCatalogOut(BaseModel):
    id: int
    code: str
    name: str
    category: TestCategory
    description: Optional[str]
    sample_type: Optional[str]
    turnaround_hours: int
    price: float
    reference_ranges: Optional[Any]
    is_active: bool

    model_config = {"from_attributes": True}


# ── Order ──────────────────────────────────────────────────────────────────

class OrderItemIn(BaseModel):
    test_id: int
    notes: Optional[str] = None


class OrderCreate(BaseModel):
    patient_id: int
    physician_id: Optional[int] = None
    priority: OrderPriority = OrderPriority.Routine
    clinical_notes: Optional[str] = None
    diagnosis_code: Optional[str] = None
    tests: List[OrderItemIn]


class OrderUpdate(BaseModel):
    physician_id: Optional[int] = None
    priority: Optional[OrderPriority] = None
    clinical_notes: Optional[str] = None
    diagnosis_code: Optional[str] = None
    status: Optional[OrderStatus] = None
    cancelled_reason: Optional[str] = None


class OrderItemOut(BaseModel):
    id: int
    test_id: int
    test: TestCatalogOut
    notes: Optional[str]

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    order_number: str
    patient_id: int
    patient: PatientOut
    physician_id: Optional[int]
    status: OrderStatus
    priority: OrderPriority
    clinical_notes: Optional[str]
    diagnosis_code: Optional[str]
    items: List[OrderItemOut]
    ordered_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Specimen ───────────────────────────────────────────────────────────────

class SpecimenCreate(BaseModel):
    order_id: int
    sample_type: str
    volume_ml: Optional[float] = None
    container_type: Optional[str] = None
    collection_site: Optional[str] = None
    notes: Optional[str] = None


class SpecimenUpdate(BaseModel):
    status: Optional[SpecimenStatus] = None
    received_at: Optional[datetime] = None
    storage_location: Optional[str] = None
    notes: Optional[str] = None


class SpecimenOut(BaseModel):
    id: int
    barcode: str
    order_id: int
    sample_type: Optional[str]
    volume_ml: Optional[float]
    container_type: Optional[str]
    collection_site: Optional[str]
    status: SpecimenStatus
    collected_at: Optional[datetime]
    received_at: Optional[datetime]
    storage_location: Optional[str]
    notes: Optional[str]

    model_config = {"from_attributes": True}


# ── Results ────────────────────────────────────────────────────────────────

class ResultCreate(BaseModel):
    order_id: int
    test_id: int
    result_value: str
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    is_abnormal: bool = False
    is_critical: bool = False
    interpretation: Optional[str] = None


class ResultUpdate(BaseModel):
    result_value: Optional[str] = None
    result_unit: Optional[str] = None
    reference_range: Optional[str] = None
    is_abnormal: Optional[bool] = None
    is_critical: Optional[bool] = None
    interpretation: Optional[str] = None
    status: Optional[ResultStatus] = None


class ResultOut(BaseModel):
    id: int
    order_id: int
    test_id: int
    test: TestCatalogOut
    result_value: Optional[str]
    result_unit: Optional[str]
    reference_range: Optional[str]
    is_abnormal: bool
    is_critical: bool
    interpretation: Optional[str]
    status: ResultStatus
    entered_at: Optional[datetime]
    verified_at: Optional[datetime]
    approved_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ── Report ─────────────────────────────────────────────────────────────────

class ReportOut(BaseModel):
    id: int
    report_number: str
    order_id: int
    generated_at: Optional[datetime]
    file_path: Optional[str]

    model_config = {"from_attributes": True}


# ── Audit ──────────────────────────────────────────────────────────────────

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    resource: Optional[str]
    resource_id: Optional[int]
    detail: Optional[str]
    ip_address: Optional[str]
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}
