from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.api import auth, emotion, profile, analytics, calendar

app = FastAPI()

# Разрешаем доступ с фронтенда
origins = [
    "http://localhost:3000",  # Разрешаем доступ с этого домена (ваш фронтенд)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # фронтенд адрес
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  # обязательно разрешаем заголовки, включая Authorization
)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(auth.router)
app.include_router(emotion.router)
app.include_router(profile.router)
app.include_router(analytics.router)
app.include_router(calendar.router)
