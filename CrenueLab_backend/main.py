from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models.user import Base  # imports all models
from app.routers import auth, users, patients, tests, orders, specimens, results, reports, audit

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CrenueLab API",
    description="Life Science Analysis — Laboratory Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(tests.router)
app.include_router(orders.router)
app.include_router(specimens.router)
app.include_router(results.router)
app.include_router(reports.router)
app.include_router(audit.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "CrenueLab API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
