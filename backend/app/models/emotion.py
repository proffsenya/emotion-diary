from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class EmotionModel(Base):
    __tablename__ = 'emotions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    emotion_type = Column(String, index=True)
    name = Column(String)
    intensity = Column(Integer)
    comment = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # Добавляем поле для времени записи

    user = relationship("UserModel", back_populates="emotions")
