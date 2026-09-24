# CrenueLab Backend — FastAPI + PostgreSQL + SQLAlchemy

## Tech Stack
- **FastAPI** — REST API framework
- **PostgreSQL** — Database
- **SQLAlchemy 2.0** — ORM
- **Alembic** — Database migrations
- **Passlib + bcrypt** — Password hashing
- **python-jose** — JWT authentication
- **ReportLab** — PDF report generation

---

## Project Structure

```
creneuelab_backend/
├── app/
│   ├── core/
│   │   ├── config.py        # Settings from .env
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   └── security.py      # JWT, password hashing, role guards
│   ├── models/
│   │   └── user.py          # ALL SQLAlchemy models + enums
│   ├── schemas/
│   │   └── schemas.py       # ALL Pydantic schemas
│   ├── routers/
│   │   ├── auth.py          # POST /auth/login
│   │   ├── users.py         # Admin user CRUD
│   │   ├── patients.py      # Patient registration & search
│   │   ├── tests.py         # Test catalog
│   │   ├── orders.py        # Test order management
│   │   ├── specimens.py     # Specimen collection & tracking
│   │   ├── results.py       # Result entry, verify, approve
│   │   ├── reports.py       # PDF report generation & download
│   │   └── audit.py         # Audit log viewer
│   ├── utils/
│   │   ├── helpers.py       # ID generators, audit logger
│   │   └── pdf_generator.py # ReportLab PDF builder
│   └── main.py              # FastAPI app + CORS + router registration
├── alembic/
│   ├── env.py
│   └── versions/            # Migration files (auto-generated)
├── reports/                 # Generated PDF files (auto-created)
├── alembic.ini
├── requirements.txt
├── seed.py                  # One-time data seeder
└── .env.example
```

---

## Setup

### 1. Prerequisites
- Python 3.11+
- PostgreSQL running locally
- Virtual environment already created

### 2. Activate virtual environment
```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
cp .env.example .env
```
Edit `.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/creneuelab
SECRET_KEY=change-this-to-a-random-32-char-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### 5. Create the PostgreSQL database
```sql
CREATE DATABASE creneuelab;
```

### 6. Run Alembic migrations
```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

### 7. Seed the database
```bash
python seed.py
```
Creates:
- Admin account: `admin@creneuelab.com` / `Admin@1234`
- 20+ tests across all 5 categories

### 8. Start the server
```bash
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

## API Endpoints

### Authentication
| Method | URL | Roles | Description |
|--------|-----|-------|-------------|
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | All | Current user info |

### Users (Admin only)
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/users/` | List all users |
| POST | `/users/` | Create user |
| PATCH | `/users/{id}` | Update user |
| DELETE | `/users/{id}` | Deactivate user |

### Patients
| Method | URL | Roles |
|--------|-----|-------|
| GET | `/patients/?search=` | All roles |
| POST | `/patients/` | Admin, Receptionist |
| GET | `/patients/{id}` | All roles |
| PATCH | `/patients/{id}` | Admin, Receptionist |

### Test Orders
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/orders/` | Create order |
| GET | `/orders/?status=&patient_id=` | List orders |
| PATCH | `/orders/{id}` | Update order |
| POST | `/orders/{id}/cancel?reason=` | Cancel order |

### Specimens
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/specimens/` | Collect specimen |
| PATCH | `/specimens/{id}` | Update status/location |
| GET | `/specimens/barcode/{barcode}` | Lookup by barcode |

### Results
| Method | URL | Roles |
|--------|-----|-------|
| POST | `/results/` | Enter result | Lab Technician |
| PATCH | `/results/{id}` | Update result | Lab Tech, Pathologist |
| POST | `/results/{id}/verify` | Verify | Pathologist |
| POST | `/results/{id}/approve` | Approve | Pathologist |
| GET | `/results/order/{order_id}` | Get all results for order |

### Reports
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/reports/generate/{order_id}` | Generate PDF report |
| GET | `/reports/{id}/download` | Download PDF |
| GET | `/reports/order/{order_id}` | List reports for order |

### Audit Logs (Admin only)
| Method | URL |
|--------|-----|
| GET | `/audit/?user_id=&resource=` |

---

## Workflow

```
Register Patient → Create Order → Collect Specimen
    → Enter Results → Verify (Pathologist) → Approve (Pathologist)
        → Generate PDF Report → Download
```

## Role Permissions Summary

| Feature | Admin | Receptionist | Lab Tech | Pathologist | Physician |
|---------|-------|-------------|----------|-------------|-----------|
| Manage Users | ✓ | | | | |
| Register Patients | ✓ | ✓ | | | |
| Create Orders | ✓ | ✓ | | | ✓ |
| Collect Specimens | ✓ | ✓ | ✓ | | |
| Enter Results | ✓ | | ✓ | | |
| Verify/Approve Results | ✓ | | | ✓ | |
| Generate Reports | ✓ | | | ✓ | |
| Download Reports | ✓ | | | ✓ | ✓ |
| Audit Logs | ✓ | | | | |
