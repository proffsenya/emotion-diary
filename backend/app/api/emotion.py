from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.emotion import EmotionModel
from app.models.user import UserModel
from pydantic import BaseModel
from app.services.auth import verify_token

router = APIRouter()

# Pydantic модель для создания эмоции
class EmotionCreate(BaseModel):
    emotion_type: str
    name: str
    intensity: int
    comment: str

# Зависимость для извлечения пользователя из токена
def get_current_user(authorization: str = Header(...)):
    token = authorization.split(" ")[1]  # Берем токен из заголовка Authorization
    user = verify_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user["sub"]  # Возвращаем почту пользователя из токена

@router.post("/add_emotion")
async def add_emotion(emotion: EmotionCreate, db: Session = Depends(get_db), user_email: str = Depends(get_current_user)):
    if not emotion.emotion_type or not emotion.name or not emotion.intensity or not emotion.comment:
        raise HTTPException(status_code=422, detail="Missing required fields")

    # Получаем user_id по email из таблицы users
    user = db.query(UserModel).filter(UserModel.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_id = user.id  # Получаем user_id

    # Создание нового объекта эмоции с найденным user_id
    db_emotion = EmotionModel(
        user_id=user_id,  # Используем user_id из найденного пользователя
        emotion_type=emotion.emotion_type,
        name=emotion.name,
        intensity=emotion.intensity,
        comment=emotion.comment
    )

    db.add(db_emotion)
    db.commit()
    db.refresh(db_emotion)
    
    return {"message": "Emotion added successfully", "emotion": db_emotion}
