from alembic.config import Config
import os
from pathlib import Path
import dotenv

# Path to backend/
BASE_DIR = Path(__file__).resolve().parent

# Load backend/.env
dotenv.load_dotenv(BASE_DIR / ".env")

# Load backend/alembic.ini
config = Config(str(BASE_DIR / "alembic.ini"))

config.set_main_option(
    "sqlalchemy.url",
    os.getenv("DATABASE_URL")
)
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, get_db, Base
from .models import User
from .schemas import UserLogin, UserSignup, UserResponse

from .models import Patient
from .schemas import (
    PatientCreate,
    PatientResponse
)

from .routers import (
    auth,
    staffs,
    patients,
    test_catalog,
    test_parameters,
    test_orders,
    lab_results,
    reports
)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(staffs.router)
app.include_router(patients.router)

app.include_router(test_catalog.router)
app.include_router(test_parameters.router)

app.include_router(test_orders.router)

app.include_router(lab_results.router)

app.include_router(reports.router)
