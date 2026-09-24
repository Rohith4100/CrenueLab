from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict
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
    return db.query(LabResult).filter(LabResult.order_id!= None ).all()


# ==========================
# GET RESULT BY ID
# ==========================

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
        order = (
        db.query(TestOrder)
        .filter(TestOrder.id == result.order_id)
        .first()
        )

        if order:
            order.status = update.status

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


@router.get("/{id}/details")
def get_result_details(
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

    order = (
        db.query(TestOrder)
        .filter(
            TestOrder.id == result.order_id
        )
        .first()
    )

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == order.patient_id
        )
        .first()
    )

    test = (
        db.query(TestCatalog)
        .filter(
            TestCatalog.id == order.test_id
        )
        .first()
    )

    items = (
        db.query(ResultItem)
        .filter(
            ResultItem.result_id == id
        )
        .all()
    )

    return {
        "result": result,
        "order": order,
        "patient": patient,
        "test": test,
        "items": items
    }

@router.get("/report/{result_id}")
def get_report(
    result_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = (
        db.query(LabResult)
        .filter(LabResult.id == result_id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Result not found"
        )

    order = (
        db.query(TestOrder)
        .filter(TestOrder.id == result.order_id)
        .first()
    )

    patient = (
        db.query(Patient)
        .filter(Patient.id == order.patient_id)
        .first()
    )

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == order.test_id)
        .first()
    )

    entered_by = (
        db.query(User)
        .filter(User.id == result.entered_by)
        .first()
    )

    verified_by = None

    if result.verified_by:
        verified_by = (
            db.query(User)
            .filter(User.id == result.verified_by)
            .first()
        )

    items = (
        db.query(ResultItem)
        .filter(
            ResultItem.result_id == result.id
        )
        .all()
    )

    return {
        "result": result,
        "patient": patient,
        "test": test,
        "entered_by": entered_by,
        "verified_by": verified_by,
        "items": items
    }

@router.get("/patient/{patient_id}")
def patient_reports(
    patient_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(TestOrder)
        .filter(
            TestOrder.patient_id == patient_id
        )
        .all()
    )

    visits = defaultdict(list)

    for order in orders:

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

        visit_date = (
            order.order_date.date()
            .isoformat()
        )

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

        items = (
            db.query(ResultItem)
            .filter(
                ResultItem.result_id == result.id
            )
            .all()
        )

        parameters = []

        for item in items:

            parameter = (
                db.query(TestParameter)
                .filter(
                    TestParameter.id ==
                    item.parameter_id
                )
                .first()
            )

            parameters.append({
                "parameter":
                parameter.parameter_name,

                "value":
                item.parameter_value,

                "unit":
                parameter.unit,

                "reference":
                parameter.reference_range
            })

        visits[visit_date].append({
            "result_id": result.id,
            "test_name":
            test.test_name,
            "test_price": test.price,

            "entered_by":
            f"{technician.first_name} {technician.last_name}",

            "verified_by":
            f"{pathologist.first_name} {pathologist.last_name}",

            "parameters":
            parameters
        })

    return visits