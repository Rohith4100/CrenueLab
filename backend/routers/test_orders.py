from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    TestOrder,
    Patient,
    User,
    TestCatalog
)
from ..schemas import (
    TestOrderCreate,
    TestOrderUpdate,
    TestOrderResponse
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/test-orders",
    tags=["Test Orders"]
)


# ==========================
# CREATE TEST ORDER
# ==========================

@router.post(
    "/",
    response_model=TestOrderResponse
)
def create_test_order(
    order: TestOrderCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    patient = (
        db.query(Patient)
        .filter(Patient.id == order.patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    physician = (
        db.query(User)
        .filter(User.id == order.physician_id)
        .first()
    )

    if not physician:
        raise HTTPException(
            status_code=404,
            detail="Physician not found"
        )

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == order.test_id)
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    new_order = TestOrder(
        patient_id=order.patient_id,
        physician_id=order.physician_id,
        test_id=order.test_id,
        priority=order.priority
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return new_order


# ==========================
# GET ALL ORDERS
# ==========================

@router.get(
    "/",
    response_model=list[TestOrderResponse]
)
def get_test_orders(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(TestOrder).all()


# ==========================
# GET ORDER BY ID
# ==========================

@router.get(
    "/{id}",
    response_model=TestOrderResponse
)
def get_test_order(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    order = (
        db.query(TestOrder)
        .filter(TestOrder.id == id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Test order not found"
        )

    return order


# ==========================
# GET ORDERS BY PATIENT
# ==========================

@router.get(
    "/patient/{patient_id}",
    response_model=list[TestOrderResponse]
)
def get_patient_orders(
    patient_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return (
        db.query(TestOrder)
        .filter(
            TestOrder.patient_id == patient_id
        )
        .all()
    )


# ==========================
# GET ORDERS BY STATUS
# ==========================

@router.get(
    "/status/{status}",
    response_model=list[TestOrderResponse]
)
def get_orders_by_status(
    status: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return (
        db.query(TestOrder)
        .filter(
            TestOrder.status == status
        )
        .all()
    )


# ==========================
# UPDATE ORDER
# ==========================

@router.patch(
    "/{id}",
    response_model=TestOrderResponse
)
def update_test_order(
    id: int,
    updated_order: TestOrderUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    order = (
        db.query(TestOrder)
        .filter(TestOrder.id == id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Test order not found"
        )

    if updated_order.priority is not None:
        order.priority = updated_order.priority

    if updated_order.status is not None:
        order.status = updated_order.status

    db.commit()
    db.refresh(order)

    return order


# ==========================
# DELETE ORDER
# ==========================

@router.delete("/{id}")
def delete_test_order(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    order = (
        db.query(TestOrder)
        .filter(TestOrder.id == id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Test order not found"
        )

    db.delete(order)
    db.commit()

    return {
        "message":
        "Test order deleted successfully"
    }