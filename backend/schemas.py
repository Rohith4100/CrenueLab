from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


# ==================================
# USERS
# ==================================

class UserSignup(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    phone: Optional[str]
    address: Optional[str]

    class Config:
        from_attributes = True


# ==================================
# PATIENTS
# ==================================

class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    dob: date
    gender: str
    phone: str
    email: str
    address: str
    blood_group: str


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    blood_group: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    dob: date
    gender: str
    phone: str
    email: str
    address: str
    blood_group: str

    class Config:
        from_attributes = True


# ==================================
# TEST CATALOG
# ==================================

class TestCatalogCreate(BaseModel):
    test_name: str
    description: Optional[str] = None
    price: float


class TestCatalogUpdate(BaseModel):
    test_name: Optional[str] = None
    description: Optional[str] = None
    price: float | None = None


class TestCatalogResponse(BaseModel):
    id: int
    test_name: str
    description: Optional[str]
    price: float

    class Config:
        from_attributes = True


# ==================================
# TEST PARAMETERS
# ==================================

class TestParameterCreate(BaseModel):
    test_id: int
    parameter_name: str
    unit: Optional[str] = None
    reference_range: Optional[str] = None


class TestParameterUpdate(BaseModel):
    parameter_name: Optional[str] = None
    unit: Optional[str] = None
    reference_range: Optional[str] = None


class TestParameterResponse(BaseModel):
    id: int
    test_id: int
    parameter_name: str
    unit: Optional[str]
    reference_range: Optional[str]

    class Config:
        from_attributes = True


# ==================================
# TEST ORDERS
# ==================================

class TestOrderCreate(BaseModel):
    patient_id: int
    physician_id: int
    test_id: int
    priority: str = "Normal"


class TestOrderUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None


class TestOrderResponse(BaseModel):
    id: int
    patient_id: int
    physician_id: int
    test_id: int
    priority: str
    status: str
    order_date: datetime

    class Config:
        from_attributes = True


# ==================================
# LAB RESULTS
# ==================================
class ResultEntry(BaseModel):
    parameter_id: int
    parameter_value: str
    
class LabResultCreate(BaseModel):
    order_id: int
    entered_by: int
    items: list[ResultEntry]


class LabResultUpdate(BaseModel):
    verified_by: Optional[int] = None
    status: Optional[str] = None


class LabResultResponse(BaseModel):
    id: int
    order_id: int
    entered_by: int
    verified_by: Optional[int]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==================================
# RESULT ITEMS
# ==================================

class ResultItemCreate(BaseModel):
    parameter_id: int
    parameter_value: str


class ResultItemUpdate(BaseModel):
    parameter_value: Optional[str] = None


class ResultItemResponse(BaseModel):
    id: int
    result_id: int
    parameter_id: int
    parameter_value: str

    class Config:
        from_attributes = True


# ==================================
# REPORTS
# ==================================

class ReportCreate(BaseModel):
    result_id: int
    approved_by: int
    report_path: str


class ReportUpdate(BaseModel):
    approved_by: Optional[int] = None
    report_path: Optional[str] = None
    status: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    result_id: int
    approved_by: int
    report_path: str
    status: str
    approved_at: Optional[datetime]

    class Config:
        from_attributes = True