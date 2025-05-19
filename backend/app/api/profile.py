from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
from datetime import date
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import UserModel
from app.services.auth import verify_token

router = APIRouter()

class UserUpdateModel(BaseModel):
    phone: Optional[str] = None
    lastName: Optional[str] = None
    firstName: Optional[str] = None
    middleName: Optional[str] = None
    birthDate: Optional[date] = None
    password: Optional[str] = None

@router.get("/user_profile")
async def get_user_profile(authorization: dict = Depends(verify_token), db: Session = Depends(get_db)):
    user_email = authorization["sub"]
    user = db.query(UserModel).filter(UserModel.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "email": user.email,
        "phone": user.phone,
        "lastName": user.last_name,
        "firstName": user.first_name,
        "middleName": user.middle_name,
        "birthDate": user.birthDate if user.birthDate else None,
    }

@router.put("/update_profile")
async def update_user_profile(
    profile_data: UserUpdateModel = Body(...),
    authorization: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user_email = authorization["sub"]
    user = db.query(UserModel).filter(UserModel.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if profile_data.phone is not None:
        user.phone = profile_data.phone
    if profile_data.lastName is not None:
        user.last_name = profile_data.lastName
    if profile_data.firstName is not None:
        user.first_name = profile_data.firstName
    if profile_data.middleName is not None:
        user.middle_name = profile_data.middleName
    if profile_data.birthDate is not None:
        user.birthDate = profile_data.birthDate
    if profile_data.password is not None:
        user.password = profile_data.password  # Рекомендую добавить хэширование!

    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully"}
