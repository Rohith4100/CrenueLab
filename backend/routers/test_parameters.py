from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import (
    TestCatalog,
    TestParameter
)
from ..schemas import (
    TestParameterCreate,
    TestParameterUpdate,
    TestParameterResponse
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/test-parameters",
    tags=["Test Parameters"]
)


# ==========================
# CREATE PARAMETER
# ==========================

@router.post(
    "/",
    response_model=TestParameterResponse
)
def create_parameter(
    parameter: TestParameterCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    test = (
        db.query(TestCatalog)
        .filter(
            TestCatalog.id == parameter.test_id
        )
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    new_parameter = TestParameter(
        test_id=parameter.test_id,
        parameter_name=parameter.parameter_name,
        unit=parameter.unit,
        reference_range=parameter.reference_range
    )

    db.add(new_parameter)
    db.commit()
    db.refresh(new_parameter)

    return new_parameter


# ==========================
# GET ALL PARAMETERS
# ==========================

@router.get(
    "/",
    response_model=list[TestParameterResponse]
)
def get_parameters(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(TestParameter).filter(TestParameter.test_id != None).all()


# ==========================
# GET PARAMETER BY ID
# ==========================

@router.get(
    "/{id}",
    response_model=TestParameterResponse
)
def get_parameter(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    parameter = (
        db.query(TestParameter)
        .filter(TestParameter.id == id)
        .first()
    )

    if not parameter:
        raise HTTPException(
            status_code=404,
            detail="Parameter not found"
        )

    return parameter


# ==========================
# GET PARAMETERS BY TEST
# ==========================

@router.get(
    "/test/{test_id}",
    response_model=list[TestParameterResponse]
)
def get_test_parameters(
    test_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == test_id)
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    return (
        db.query(TestParameter)
        .filter(
            TestParameter.test_id == test_id
        )
        .all()
    )


# ==========================
# UPDATE PARAMETER
# ==========================

@router.patch(
    "/{id}",
    response_model=TestParameterResponse
)
def update_parameter(
    id: int,
    updated_parameter: TestParameterUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    parameter = (
        db.query(TestParameter)
        .filter(TestParameter.id == id)
        .first()
    )

    if not parameter:
        raise HTTPException(
            status_code=404,
            detail="Parameter not found"
        )

    if updated_parameter.parameter_name is not None:
        parameter.parameter_name = (
            updated_parameter.parameter_name
        )

    if updated_parameter.unit is not None:
        parameter.unit = updated_parameter.unit

    if updated_parameter.reference_range is not None:
        parameter.reference_range = (
            updated_parameter.reference_range
        )

    db.commit()
    db.refresh(parameter)

    return parameter


# ==========================
# DELETE PARAMETER
# ==========================

@router.delete("/{id}")
def delete_parameter(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    parameter = (
        db.query(TestParameter)
        .filter(TestParameter.id == id)
        .first()
    )

    if not parameter:
        raise HTTPException(
            status_code=404,
            detail="Parameter not found"
        )

    db.delete(parameter)
    db.commit()

    return {
        "message":
        "Parameter deleted successfully"
    }