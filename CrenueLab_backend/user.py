import enum
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Date, Text,
    ForeignKey, Enum, Float, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


# ── Enums ──────────────────────────────────────────────────────────────────

class UserRole(str, enum.Enum):
    Admin = "Admin"
    Receptionist = "Receptionist"
    LabTechnician = "Lab Technician"
    Pathologist = "Pathologist"
    Physician = "Physician"


class Gender(str, enum.Enum):
    Male = "Male"
    Female = "Female"
    Other = "Other"


class OrderStatus(str, enum.Enum):
    New = "New"
    Collected = "Collected"
    InProgress = "In Progress"
    Completed = "Completed"
    Reported = "Reported"
    Cancelled = "Cancelled"


class OrderPriority(str, enum.Enum):
    Routine = "Routine"
    Urgent = "Urgent"
    STAT = "STAT"


class SpecimenStatus(str, enum.Enum):
    Pending = "Pending"
    Collected = "Collected"
    Received = "Received"
    Processing = "Processing"
    Stored = "Stored"
    Disposed = "Disposed"


class ResultStatus(str, enum.Enum):
    Pending = "Pending"
    Entered = "Entered"
    Verified = "Verified"
    Approved = "Approved"
    Reported = "Reported"


class TestCategory(str, enum.Enum):
    Hematology = "Hematology"
    Biochemistry = "Biochemistry"
    Microbiology = "Microbiology"
    MolecularDiagnostics = "Molecular Diagnostics"
    Pathology = "Pathology"


# ── Models ─────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    orders_created = relationship("TestOrder", back_populates="created_by_user",
                                  foreign_keys="TestOrder.created_by")
    orders_physician = relationship("TestOrder", back_populates="physician_user",
                                    foreign_keys="TestOrder.physician_id")
    audit_logs = relationship("AuditLog", back_populates="user")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(20), unique=True, index=True, nullable=False)  # e.g. PAT-0001
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    phone = Column(String(20))
    email = Column(String(200))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(50))
    zip_code = Column(String(10))

    # Insurance
    insurance_provider = Column(String(150))
    insurance_policy_number = Column(String(50))
    insurance_group_number = Column(String(50))

    # Medical history (free text reference)
    medical_history = Column(Text)
    allergies = Column(Text)
    referring_physician = Column(String(150))

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    orders = relationship("TestOrder", back_populates="patient")


class TestCatalog(Base):
    """Master list of available tests."""
    __tablename__ = "test_catalog"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)  # e.g. CBC, GLU
    name = Column(String(200), nullable=False)
    category = Column(Enum(TestCategory), nullable=False)
    description = Column(Text)
    sample_type = Column(String(100))  # Blood, Urine, Tissue, etc.
    turnaround_hours = Column(Integer, default=24)
    price = Column(Float, default=0.0)
    reference_ranges = Column(JSON)  # {"male": {"min": 4.5, "max": 5.5, "unit": "M/uL"}, ...}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    order_items = relationship("OrderItem", back_populates="test")
    results = relationship("TestResult", back_populates="test")


class TestOrder(Base):
    __tablename__ = "test_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, index=True, nullable=False)  # e.g. ORD-20240101-001
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    physician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.New, nullable=False)
    priority = Column(Enum(OrderPriority), default=OrderPriority.Routine)
    clinical_notes = Column(Text)
    diagnosis_code = Column(String(20))  # ICD-10
    ordered_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    cancelled_reason = Column(Text)

    # Relationships
    patient = relationship("Patient", back_populates="orders")
    physician_user = relationship("User", back_populates="orders_physician",
                                  foreign_keys=[physician_id])
    created_by_user = relationship("User", back_populates="orders_created",
                                   foreign_keys=[created_by])
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    specimen = relationship("Specimen", back_populates="order", uselist=False)
    results = relationship("TestResult", back_populates="order")


class OrderItem(Base):
    """Individual tests within an order."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("test_orders.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("test_catalog.id"), nullable=False)
    notes = Column(Text)

    # Relationships
    order = relationship("TestOrder", back_populates="items")
    test = relationship("TestCatalog", back_populates="order_items")


class Specimen(Base):
    __tablename__ = "specimens"

    id = Column(Integer, primary_key=True, index=True)
    barcode = Column(String(50), unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("test_orders.id"), nullable=False)
    collected_by = Column(Integer, ForeignKey("users.id"))
    sample_type = Column(String(100))  # Blood, Urine, Tissue, Swab
    volume_ml = Column(Float)
    container_type = Column(String(100))  # EDTA tube, SST, etc.
    collection_site = Column(String(100))
    status = Column(Enum(SpecimenStatus), default=SpecimenStatus.Pending)
    collected_at = Column(DateTime(timezone=True))
    received_at = Column(DateTime(timezone=True))
    storage_location = Column(String(100))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    order = relationship("TestOrder", back_populates="specimen")
    collector = relationship("User", foreign_keys=[collected_by])


class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("test_orders.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("test_catalog.id"), nullable=False)
    entered_by = Column(Integer, ForeignKey("users.id"))
    verified_by = Column(Integer, ForeignKey("users.id"))
    approved_by = Column(Integer, ForeignKey("users.id"))

    # Result values
    result_value = Column(String(500))
    result_unit = Column(String(50))
    reference_range = Column(String(200))
    is_abnormal = Column(Boolean, default=False)
    is_critical = Column(Boolean, default=False)
    interpretation = Column(Text)  # Pathologist note

    status = Column(Enum(ResultStatus), default=ResultStatus.Pending)
    entered_at = Column(DateTime(timezone=True))
    verified_at = Column(DateTime(timezone=True))
    approved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order = relationship("TestOrder", back_populates="results")
    test = relationship("TestCatalog", back_populates="results")
    entered_by_user = relationship("User", foreign_keys=[entered_by])
    verified_by_user = relationship("User", foreign_keys=[verified_by])
    approved_by_user = relationship("User", foreign_keys=[approved_by])


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(30), unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("test_orders.id"), nullable=False)
    generated_by = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String(500))   # path to stored PDF
    report_type = Column(String(50), default="PDF")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)

    order = relationship("TestOrder")
    generated_by_user = relationship("User", foreign_keys=[generated_by])


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)  # CREATE_ORDER, LOGIN, etc.
    resource = Column(String(100))                # orders, patients, results
    resource_id = Column(Integer)
    detail = Column(Text)
    ip_address = Column(String(45))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="audit_logs")
