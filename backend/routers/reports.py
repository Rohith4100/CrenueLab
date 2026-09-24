from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from reportlab.platypus import KeepTogether
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
import os
from reportlab.lib.styles import getSampleStyleSheet
from ..database import get_db
from ..models import (
    LabResult,
    ResultItem,
    TestOrder,
    TestParameter,
    User,
    Patient,
    TestCatalog
)
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image
)
from ..schemas import (
    LabResultCreate,
    LabResultUpdate,
    LabResultResponse
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/lab-results",
    tags=["Lab Results"]
)


# ==========================
# CREATE LAB RESULT
# ==========================

@router.post(
    "/",
    response_model=LabResultResponse
)
def create_lab_result(
    result: LabResultCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    order = (
        db.query(TestOrder)
        .filter(TestOrder.id == result.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Test order not found"
        )

    technician = (
        db.query(User)
        .filter(User.id == result.entered_by)
        .first()
    )

    if not technician:
        raise HTTPException(
            status_code=404,
            detail="Technician not found"
        )

    new_result = LabResult(
        order_id=result.order_id,
        entered_by=result.entered_by
    )

    db.add(new_result)
    db.flush()

    for item in result.items:

        parameter = (
            db.query(TestParameter)
            .filter(
                TestParameter.id ==
                item.parameter_id
            )
            .first()
        )

        if not parameter:
            raise HTTPException(
                status_code=404,
                detail=f"Parameter {item.parameter_id} not found"
            )

        result_item = ResultItem(
            result_id=new_result.id,
            parameter_id=item.parameter_id,
            parameter_value=item.parameter_value
        )

        db.add(result_item)

    order.status = "Completed"

    db.commit()
    db.refresh(new_result)

    return new_result


# ==========================
# GET ALL RESULTS
# ==========================

@router.get(
    "/",
    response_model=list[LabResultResponse]
)
def get_lab_results(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(LabResult).all()


# ==========================
# GET RESULT BY ID
# ==========================

@router.get("/visit-pdf/{patient_id}/{visit_date}")
def generate_visit_pdf(
    patient_id: int,
    visit_date: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    orders = (
        db.query(TestOrder)
        .filter(
            TestOrder.patient_id == patient_id
        )
        .all()
    )

    visit_orders = []

    for order in orders:
        if (
            order.order_date.date().isoformat()
            == visit_date
        ):
            visit_orders.append(order)

    if not visit_orders:
        raise HTTPException(
            status_code=404,
            detail="No reports found for this visit"
        )

    os.makedirs(
        "reports",
        exist_ok=True
    )

    filename = (
        f"reports/visit_{patient_id}_{visit_date}.pdf"
    )

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    content = []

    # =====================
    # HEADER
    # =====================
    BASE_DIR = os.path.dirname(
        os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
    )
    logo_path = os.path.join(
        BASE_DIR,
        "frontend",
        "public",
        "crenuelab.png"
    )
    
    logo = Image(
    logo_path,
    width=220,
    height=80
    )

    content.append(logo)
    content.append(
        Spacer(1, 20)
    )
    content.append(
        Spacer(1, 5)
    )

    content.append(
        Paragraph(
            "<b>LABORATORY TEST REPORT</b>",
            styles["Heading1"]
        )
    )
    
    content.append(
        Paragraph(
            "Life Science Analysis",
            styles["Normal"]
        )
    )

    content.append(
        Spacer(1, 20)
    )
        # =====================
        # PATIENT DETAILS
    # =====================

    patient_table = Table(
        [
            [
                "Patient Name",
                f"{patient.first_name} {patient.last_name}"
            ],
            [
                "Phone",
                patient.phone or "-"
            ],
            [
                "Gender",
                patient.gender or "-"
            ],
            [
                "Blood Group",
                patient.blood_group or "-"
            ],
            [
                "Visit Date",
                visit_date
            ]
        ],
        colWidths=[120, 320]
    )

    patient_table.setStyle(
        TableStyle([
            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),

            (
                "BACKGROUND",
                (0, 0),
                (0, -1),
                colors.HexColor("#dbeafe")
            ),

            (
                "FONTNAME",
                (0, 0),
                (0, -1),
                "Helvetica-Bold"
            )
        ])
    )
    patient_table.hAlign = "LEFT"

    content.append(patient_table)

    # content.append(
    #     Spacer(1, 20)
    # )

    # =====================
    # ALL TESTS IN VISIT
    # =====================
    visit_total = 0

    for order in visit_orders:
        test = db.query(TestCatalog).filter(
        TestCatalog.id == order.test_id
    ).first()

        visit_total += test.price
        result = (
            db.query(LabResult)
            .filter(
                LabResult.order_id == order.id,
                LabResult.status == "Verified"
            )
            .first()
        )

        if not result:
            continue

        test = (
            db.query(TestCatalog)
            .filter(
                TestCatalog.id == order.test_id
            )
            .first()
        )

        technician = (
            db.query(User)
            .filter(
                User.id == result.entered_by
            )
            .first()
        )

        pathologist = (
            db.query(User)
            .filter(
                User.id == result.verified_by
            )
            .first()
        )

        content.append(
            Paragraph(
                test.test_name,
                styles["Heading2"]
            )
        )

        content.append(
            Paragraph(
                f"Entered By: "
                f"{technician.first_name} "
                f"{technician.last_name}",
                styles["Normal"]
            )
        )

        if pathologist:
            content.append(
                Paragraph(
                    f"Verified By: "
                    f"{pathologist.first_name} "
                    f"{pathologist.last_name}",
                    styles["Normal"]
                )
            )

        content.append(
            Spacer(1, 10)
        )

        table_data = [
            [
                "Parameter",
                "Value",
                "Unit",
                "Reference Range"
            ]
        ]

        items = (
            db.query(ResultItem)
            .filter(
                ResultItem.result_id ==
                result.id
            )
            .all()
        )

        for item in items:

            parameter = (
                db.query(TestParameter)
                .filter(
                    TestParameter.id ==
                    item.parameter_id
                )
                .first()
            )

            table_data.append([
                parameter.parameter_name,
                item.parameter_value,
                parameter.unit or "-",
                parameter.reference_range or "-"
            ])

        table = Table(
            table_data,
            colWidths=[
                150,
                100,
                80,
                150
            ]
        )

        table.setStyle(
            TableStyle([
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2563eb")
                ),

                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),

                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    1,
                    colors.black
                ),

                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.whitesmoke,
                        colors.white
                    ]
                )
            ])
        )
        table.hAlign = "LEFT"
        content.append(table)

        # content.append(
        #     Spacer(1, 20)
        # )
    # =====================
    # BILLING SUMMARY
    # =====================

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            "<b>BILLING SUMMARY</b>",
            styles["Heading2"]
        )
    )

    bill_data = [
        ["Test Name", "Price (Rs.)"]
    ]

    for order in visit_orders:

        test = (
            db.query(TestCatalog)
            .filter(
                TestCatalog.id == order.test_id
            )
            .first()
        )

        bill_data.append([
            test.test_name,
            f"Rs. {test.price:.2f}"
        ])

    bill_data.append([
        "TOTAL BILL",
        f"Rs. {visit_total:.2f}"
    ])

    bill_table = Table(
        bill_data,
        colWidths=[300, 180]
        
    )

    bill_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#2563eb")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                1,
                colors.black
            ),

            (
                "BACKGROUND",
                (0, -1),
                (-1, -1),
                colors.HexColor("#dcfce7")
            ),

            (
                "FONTNAME",
                (0, -1),
                (-1, -1),
                "Helvetica-Bold"
            ),

            (
                "FONTSIZE",
                (0, -1),
                (-1, -1),
                12
            ),

            (
                "ALIGN",
                (1, 0),
                (1, -1),
                "RIGHT"
            )
        ])
    )
    bill_table.hAlign = "LEFT"
    content.append(bill_table)

    # =====================
    # FOOTER
    # =====================

    content.append(
        Paragraph(
            "Generated by CrenueLab",
            styles["Italic"]
        )
    )

    doc.build(content)

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=(
            f"Visit_Report_{visit_date}.pdf"
        )
    )

@router.get(
    "/{id}",
    response_model=LabResultResponse
)
def get_lab_result(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    result = (
        db.query(LabResult)
        .filter(LabResult.id == id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    return result


# ==========================
# VERIFY RESULT
# ==========================

@router.patch(
    "/{id}",
    response_model=LabResultResponse
)
def verify_lab_result(
    id: int,
    update: LabResultUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    result = (
        db.query(LabResult)
        .filter(LabResult.id == id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    if update.verified_by is not None:

        verifier = (
            db.query(User)
            .filter(User.id == update.verified_by)
            .first()
        )

        if not verifier:
            raise HTTPException(
                status_code=404,
                detail="Verifier not found"
            )

        result.verified_by = update.verified_by

    if update.status is not None:
        result.status = update.status

    db.commit()
    db.refresh(result)

    return result


# ==========================
# DELETE RESULT
# ==========================

@router.delete("/{id}")
def delete_lab_result(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    result = (
        db.query(LabResult)
        .filter(LabResult.id == id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    db.delete(result)
    db.commit()

    return {
        "message": "Result deleted successfully"
    }
