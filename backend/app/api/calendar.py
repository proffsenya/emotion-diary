from fastapi import APIRouter, Depends, Header, HTTPException, Query
from sqlalchemy.orm import Session
import jwt

from app.db.database import get_db
from app.models.user import UserModel
from app.models.emotion import EmotionModel
from app.services.auth import SECRET_KEY, ALGORITHM

router = APIRouter()

@router.get("/emotion_days")
def get_emotion_days(
    year: int = Query(...),
    month: int = Query(...),
    authorization: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db)
):
    token = authorization
    if token.lower().startswith("bearer "):
        token = token[7:]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=403, detail="Invalid token payload")

    user = db.query(UserModel).filter(UserModel.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user.id

    from sqlalchemy import extract, func

    # Получаем все эмоции по дням в нужном месяце
    emotions_per_day = db.query(
        func.strftime('%d', EmotionModel.created_at).label('day'),
        EmotionModel.emotion_type
    ).filter(
        EmotionModel.user_id == user_id,
        extract('year', EmotionModel.created_at) == year,
        extract('month', EmotionModel.created_at) == month
    ).all()

    # Цвета эмоций на русском
    color_map = {
        "радость": "#FFD54F",
        "грусть": "#64B5F6",
        "гнев": "#E57373",
        "нейтральное": "#81C784",
    }

    # Маппинг английских типов эмоций в русский
    emotion_type_map = {
        "joy": "радость",
        "sadness": "грусть",
        "anger": "гнев",
        "neutral": "нейтральное"
    }

    days_dict = {}
    for day_str, emotion_type in emotions_per_day:
        day_int = int(day_str)
        # Переводим в русский тип
        emotion_ru = emotion_type_map.get(emotion_type, emotion_type)
        if day_int not in days_dict:
            days_dict[day_int] = color_map.get(emotion_ru, "#CCCCCC")

    result = [{"day": day, "color": color} for day, color in sorted(days_dict.items())]

    return result
