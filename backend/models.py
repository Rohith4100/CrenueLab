from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    Boolean,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime

from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    role = Column(String, nullable=False)

    phone = Column(String)
    address = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    is_active=Column(Boolean,default=True)
    last_login = Column(DateTime)


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)

    dob = Column(Date)

    gender = Column(String)

    phone = Column(String)

    email = Column(String)

    address = Column(Text)

    blood_group = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    orders = relationship(
        "TestOrder",
        back_populates="patient"
    )


class TestCatalog(Base):
    __tablename__ = "test_catalog"
    id = Column(Integer, primary_key=True)
    test_name = Column(
        String,
        unique=True,
        nullable=False
    )
    description = Column(Text)
    price = Column(
    Float,
    nullable=False,
    default=0
)
    parameters = relationship(
        "TestParameter",
        back_populates="test"
    )
    orders = relationship(
        "TestOrder",
        back_populates="test"
    )

class TestParameter(Base):
    __tablename__ = "test_parameters"

    id = Column(Integer, primary_key=True)

    test_id = Column(
        Integer,
        ForeignKey("test_catalog.id"),
        nullable=False
    )

    parameter_name = Column(
        String,
        nullable=False
    )

    unit = Column(String)

    reference_range = Column(String)

    test = relationship(
        "TestCatalog",
        back_populates="parameters"
    )

class TestOrder(Base):
    __tablename__ = "test_orders"

    id = Column(Integer, primary_key=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id")
    )

    physician_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    test_id = Column(
        Integer,
        ForeignKey("test_catalog.id")
    )

    priority = Column(
        String,
        default="Normal"
    )

    status = Column(
        String,
        default="New"
    )

    order_date = Column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship(
        "Patient",
        back_populates="orders"
    )

    test = relationship(
        "TestCatalog",
        back_populates="orders"
    )

    results = relationship(
        "LabResult",
        back_populates="order"
    )
    visit_id = Column(
        String,
    )    


class LabResult(Base):
    __tablename__ = "lab_results"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("test_orders.id")
    )

    entered_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    verified_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    status = Column(
        String,
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    order = relationship(
        "TestOrder",
        back_populates="results"
    )

    items = relationship(
        "ResultItem",
        back_populates="result",
        cascade="all, delete"
    )


class ResultItem(Base):
    __tablename__ = "result_items"

    id = Column(Integer, primary_key=True)

    result_id = Column(
        Integer,
        ForeignKey("lab_results.id")
    )

    parameter_id = Column(
        Integer,
        ForeignKey("test_parameters.id")
    )

    parameter_value = Column(String)

    result = relationship(
        "LabResult",
        back_populates="items"
    )

    parameter = relationship(
        "TestParameter"
    )


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)

    result_id = Column(
        Integer,
        ForeignKey("lab_results.id")
    )

    approved_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    report_path = Column(String)

    status = Column(
        String,
        default="Pending"
    )

    approved_at = Column(DateTime)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )