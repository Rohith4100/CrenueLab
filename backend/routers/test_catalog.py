from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import TestCatalog
from ..schemas import (
    TestCatalogCreate,
    TestCatalogUpdate,
    TestCatalogResponse
)
from ..auth_utils import get_current_user

router = APIRouter(
    prefix="/test-catalog",
    tags=["Test Catalog"]
)


# ==========================
# CREATE TEST
# ==========================

@router.post(
    "/",
    response_model=TestCatalogResponse
)
def create_test(
    test: TestCatalogCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    existing_test = (
        db.query(TestCatalog)
        .filter(
            TestCatalog.test_name == test.test_name
        )
        .first()
    )

    if existing_test:
        raise HTTPException(
            status_code=400,
            detail="Test already exists"
        )

    new_test = TestCatalog(
    test_name=test.test_name,
    description=test.description,
    price=test.price
)

    db.add(new_test)
    db.commit()
    db.refresh(new_test)

    return new_test


# ==========================
# GET ALL TESTS
# ==========================

@router.get(
    "/",
    response_model=list[TestCatalogResponse]
)
def get_tests(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(TestCatalog).all()


# ==========================
# GET TEST BY ID
# ==========================

@router.get(
    "/{id}",
    response_model=TestCatalogResponse
)
def get_test(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == id)
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    return test


# ==========================
# UPDATE TEST
# ==========================

@router.patch(
    "/{id}",
    response_model=TestCatalogResponse
)
def update_test(
    id: int,
    updated_test: TestCatalogUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == id)
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    if updated_test.test_name is not None:
        test.test_name = updated_test.test_name

    if updated_test.description is not None:
        test.description = updated_test.description
    if updated_test.price is not None:
        test.price = updated_test.price
    db.commit()
    db.refresh(test)

    return test


# ==========================
# DELETE TEST
# ==========================

@router.delete("/{id}")
def delete_test(
    id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    test = (
        db.query(TestCatalog)
        .filter(TestCatalog.id == id)
        .first()
    )

    if not test:
        raise HTTPException(
            status_code=404,
            detail="Test not found"
        )

    db.delete(test)
    db.commit()

    return {
        "message": "Test deleted successfully"
    }