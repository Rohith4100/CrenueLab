"""
Run once to seed the database with:
  - Default Admin user
  - Full test catalog (Hematology, Biochemistry, Microbiology, Molecular, Pathology)

Usage:
    python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models.user import Base, User, UserRole, TestCatalog, TestCategory
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)


TESTS = [
    # Hematology
    {"code": "CBC", "name": "Complete Blood Count", "category": TestCategory.Hematology,
     "sample_type": "EDTA Blood", "turnaround_hours": 4, "price": 15.0,
     "reference_ranges": {
         "WBC": {"min": 4.5, "max": 11.0, "unit": "K/uL"},
         "RBC_male": {"min": 4.5, "max": 5.5, "unit": "M/uL"},
         "RBC_female": {"min": 4.0, "max": 5.0, "unit": "M/uL"},
         "Hemoglobin_male": {"min": 13.5, "max": 17.5, "unit": "g/dL"},
         "Hemoglobin_female": {"min": 12.0, "max": 15.5, "unit": "g/dL"},
         "Hematocrit_male": {"min": 41, "max": 53, "unit": "%"},
         "Platelet": {"min": 150, "max": 400, "unit": "K/uL"},
     }},
    {"code": "ESR", "name": "Erythrocyte Sedimentation Rate", "category": TestCategory.Hematology,
     "sample_type": "EDTA Blood", "turnaround_hours": 2, "price": 8.0,
     "reference_ranges": {"male": {"max": 15, "unit": "mm/hr"}, "female": {"max": 20, "unit": "mm/hr"}}},
    {"code": "PT", "name": "Prothrombin Time", "category": TestCategory.Hematology,
     "sample_type": "Citrate Blood", "turnaround_hours": 4, "price": 12.0,
     "reference_ranges": {"PT": {"min": 11.0, "max": 13.5, "unit": "seconds"}}},

    # Biochemistry
    {"code": "GLU", "name": "Fasting Blood Glucose", "category": TestCategory.Biochemistry,
     "sample_type": "Serum", "turnaround_hours": 2, "price": 6.0,
     "reference_ranges": {"fasting": {"min": 70, "max": 99, "unit": "mg/dL"}}},
    {"code": "HBA1C", "name": "HbA1c (Glycated Hemoglobin)", "category": TestCategory.Biochemistry,
     "sample_type": "EDTA Blood", "turnaround_hours": 4, "price": 18.0,
     "reference_ranges": {"normal": {"max": 5.7, "unit": "%"}, "prediabetes": {"min": 5.7, "max": 6.4}}},
    {"code": "LIPID", "name": "Lipid Profile", "category": TestCategory.Biochemistry,
     "sample_type": "Serum", "turnaround_hours": 4, "price": 20.0,
     "reference_ranges": {
         "Total_Cholesterol": {"max": 200, "unit": "mg/dL"},
         "LDL": {"max": 100, "unit": "mg/dL"},
         "HDL_male": {"min": 40, "unit": "mg/dL"},
         "HDL_female": {"min": 50, "unit": "mg/dL"},
         "Triglycerides": {"max": 150, "unit": "mg/dL"},
     }},
    {"code": "LFT", "name": "Liver Function Tests", "category": TestCategory.Biochemistry,
     "sample_type": "Serum", "turnaround_hours": 6, "price": 25.0,
     "reference_ranges": {
         "ALT": {"min": 7, "max": 56, "unit": "U/L"},
         "AST": {"min": 10, "max": 40, "unit": "U/L"},
         "Bilirubin_total": {"min": 0.2, "max": 1.2, "unit": "mg/dL"},
     }},
    {"code": "RFT", "name": "Renal Function Tests", "category": TestCategory.Biochemistry,
     "sample_type": "Serum", "turnaround_hours": 6, "price": 22.0,
     "reference_ranges": {
         "Creatinine_male": {"min": 0.74, "max": 1.35, "unit": "mg/dL"},
         "BUN": {"min": 7, "max": 20, "unit": "mg/dL"},
         "eGFR": {"min": 60, "unit": "mL/min/1.73m²"},
     }},
    {"code": "TSH", "name": "Thyroid Stimulating Hormone", "category": TestCategory.Biochemistry,
     "sample_type": "Serum", "turnaround_hours": 8, "price": 20.0,
     "reference_ranges": {"TSH": {"min": 0.4, "max": 4.0, "unit": "mIU/L"}}},

    # Microbiology
    {"code": "URINE_CULT", "name": "Urine Culture & Sensitivity", "category": TestCategory.Microbiology,
     "sample_type": "Mid-stream Urine", "turnaround_hours": 48, "price": 30.0,
     "reference_ranges": {"colony_count": {"max": 10000, "unit": "CFU/mL"}}},
    {"code": "BLOOD_CULT", "name": "Blood Culture", "category": TestCategory.Microbiology,
     "sample_type": "Blood (aerobic + anaerobic)", "turnaround_hours": 120, "price": 45.0,
     "reference_ranges": {"result": {"normal": "No growth after 5 days"}}},
    {"code": "STOOL_CULT", "name": "Stool Culture", "category": TestCategory.Microbiology,
     "sample_type": "Stool", "turnaround_hours": 72, "price": 28.0, "reference_ranges": {}},
    {"code": "GRAM_STAIN", "name": "Gram Stain", "category": TestCategory.Microbiology,
     "sample_type": "Specimen (wound/fluid)", "turnaround_hours": 2, "price": 10.0, "reference_ranges": {}},

    # Molecular Diagnostics
    {"code": "COVID_PCR", "name": "COVID-19 RT-PCR", "category": TestCategory.MolecularDiagnostics,
     "sample_type": "Nasopharyngeal Swab", "turnaround_hours": 24, "price": 50.0,
     "reference_ranges": {"result": {"normal": "Not Detected"}}},
    {"code": "HBV_DNA", "name": "Hepatitis B Viral Load (PCR)", "category": TestCategory.MolecularDiagnostics,
     "sample_type": "Serum", "turnaround_hours": 48, "price": 80.0,
     "reference_ranges": {"undetectable": {"max": 20, "unit": "IU/mL"}}},
    {"code": "HPV_DNA", "name": "HPV DNA Test", "category": TestCategory.MolecularDiagnostics,
     "sample_type": "Cervical Swab", "turnaround_hours": 48, "price": 75.0, "reference_ranges": {}},
    {"code": "MTB_PCR", "name": "Mycobacterium Tuberculosis PCR", "category": TestCategory.MolecularDiagnostics,
     "sample_type": "Sputum / BAL", "turnaround_hours": 24, "price": 90.0,
     "reference_ranges": {"result": {"normal": "Not Detected"}}},

    # Pathology
    {"code": "HISTO_BIOPSY", "name": "Histopathology — Biopsy", "category": TestCategory.Pathology,
     "sample_type": "Tissue Block (FFPE)", "turnaround_hours": 72, "price": 120.0, "reference_ranges": {}},
    {"code": "PAP_SMEAR", "name": "Pap Smear (Cervical Cytology)", "category": TestCategory.Pathology,
     "sample_type": "Cervical Smear", "turnaround_hours": 48, "price": 35.0, "reference_ranges": {}},
    {"code": "FNAC", "name": "Fine Needle Aspiration Cytology", "category": TestCategory.Pathology,
     "sample_type": "Aspirate", "turnaround_hours": 48, "price": 60.0, "reference_ranges": {}},
    {"code": "IHC", "name": "Immunohistochemistry Panel", "category": TestCategory.Pathology,
     "sample_type": "Tissue Block (FFPE)", "turnaround_hours": 96, "price": 200.0, "reference_ranges": {}},
]


def seed():
    db = SessionLocal()
    try:
        # Admin user
        if not db.query(User).filter(User.email == "admin@creneuelab.com").first():
            admin = User(
                full_name="System Administrator",
                email="admin@creneuelab.com",
                hashed_password=hash_password("Admin@1234"),
                role=UserRole.Admin,
                phone="+1-000-000-0000",
                is_active=True,
            )
            db.add(admin)
            print("✓ Admin user created  →  admin@creneuelab.com / Admin@1234")
        else:
            print("· Admin user already exists, skipping.")

        # Test catalog
        added = 0
        for t in TESTS:
            if not db.query(TestCatalog).filter(TestCatalog.code == t["code"]).first():
                db.add(TestCatalog(**t))
                added += 1
        db.commit()
        print(f"✓ {added} tests added to catalog ({len(TESTS) - added} already existed).")
        print("\nSeeding complete. Start the server with:")
        print("  uvicorn app.main:app --reload --port 8000")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
