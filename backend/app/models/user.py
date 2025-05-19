from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class UserModel(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String)
    birthDate = Column(String)
    
    # Проверьте, как у вас называется поле
    last_name = Column(String)  # Пример: измените на last_name или другое название
    first_name = Column(String)
    middle_name = Column(String)

    # Связь с эмоциями
    emotions = relationship("EmotionModel", back_populates="user")

    
