from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, Integer, case
from collections import defaultdict
import jwt
import re

from app.db.database import get_db
from app.models.user import UserModel
from app.models.emotion import EmotionModel
from app.services.auth import SECRET_KEY, ALGORITHM

router = APIRouter()

day_map = {
    '0': 'Воскресенье',
    '1': 'Понедельник',
    '2': 'Вторник',
    '3': 'Среда',
    '4': 'Четверг',
    '5': 'Пятница',
    '6': 'Суббота'
}

# Русские типы эмоций в нужном порядке
emotion_types = ['грусть', 'радость', 'гнев', 'нейтральное']

# Мапа английских типов к русским
emotion_type_map = {
    "joy": "радость",
    "sadness": "грусть",
    "anger": "гнев",
    "neutral": "нейтральное"
}

@router.get("/analytics")
def get_analytics(
    authorization: str = Header(..., alias="Authorization"),
    db: Session = Depends(get_db)
):
    # Верификация токена и получение user_email
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

    # Кол-во записей эмоций
    entries_count = db.query(func.count()).filter(EmotionModel.user_id == user_id).scalar() or 0

    # Частота по категориям эмоций (англ. типы)
    freq_by_type_raw = db.query(
        EmotionModel.emotion_type,
        func.count().label("count")
    ).filter(EmotionModel.user_id == user_id).group_by(EmotionModel.emotion_type).all()

    # Мапим ключи в русские
    freq_by_type = [(emotion_type_map.get(etype, etype), cnt) for etype, cnt in freq_by_type_raw]

    if freq_by_type:
        most_common = max(freq_by_type, key=lambda x: x[1])[0]
        rarest = min(freq_by_type, key=lambda x: x[1])[0]
    else:
        most_common = None
        rarest = None

    # Средняя интенсивность
    avg_mood = db.query(func.avg(EmotionModel.intensity)).filter(EmotionModel.user_id == user_id).scalar() or 0

    # Среднее количество слов в комментариях
    comments = db.query(EmotionModel.comment).filter(
    EmotionModel.user_id == user_id,
    EmotionModel.comment != None,
    EmotionModel.comment != ''
    ).all()

# Подсчёт слов в каждом комментарии
    total_words = 0
    for c in comments:
        if c.comment:
            # Разбиваем строку по словам, включая дефисные — на отдельные слова
            words = re.findall(r"\b[\w']+\b", c.comment.replace('-', ' '))
            total_words += len(words)

    avg_word_count = total_words / len(comments) if comments else 0

    # Самое эмоциональное событие (максимальная интенсивность)
    most_emotional_event = db.query(EmotionModel).filter(
        EmotionModel.user_id == user_id
    ).order_by(EmotionModel.intensity.desc()).first()

    # moodByDay - эмоции по дню недели и категории
    mood_by_day_raw = db.query(
        func.strftime('%w', EmotionModel.created_at).label('weekday'),
        EmotionModel.emotion_type,
        func.count().label('count')
    ).filter(EmotionModel.user_id == user_id).group_by('weekday', EmotionModel.emotion_type).all()

    mood_by_day = defaultdict(lambda: defaultdict(int))
    for wd, etype, cnt in mood_by_day_raw:
        day_name = day_map.get(wd, "Неизвестно")
        # Переводим в русский тип
        etype_ru = emotion_type_map.get(etype, etype)
        mood_by_day[day_name][etype_ru] = cnt

    mood_by_day_list = []
    # Упорядоченный список дней недели
    days_order = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    for day in days_order:
        entry = {"name": day}
        for et in emotion_types:
            # Ключи с большой буквы для фронта
            entry[et.capitalize()] = mood_by_day[day].get(et, 0)
        mood_by_day_list.append(entry)

    # emotionCategories - суммарное кол-во эмоций по категориям
    emotion_categories = {et: 0 for et in emotion_types}
    for etype, cnt in freq_by_type:
        emotion_categories[etype] = cnt

    # Времена суток (утро, день, вечер, ночь)
    time_of_day_case = case(
        (func.cast(func.strftime("%H", EmotionModel.created_at), Integer).between(6, 11), "Утро"),
        (func.cast(func.strftime("%H", EmotionModel.created_at), Integer).between(12, 17), "День"),
        (func.cast(func.strftime("%H", EmotionModel.created_at), Integer).between(18, 23), "Вечер"),
        else_="Ночь"
    )

    time_of_day_data_raw = db.query(
        time_of_day_case.label("time_of_day"),
        EmotionModel.emotion_type,
        func.count().label("count")
    ).filter(EmotionModel.user_id == user_id).group_by("time_of_day", EmotionModel.emotion_type).all()

    emotion_time_of_day = {
        "Утро": {et: 0 for et in emotion_types},
        "День": {et: 0 for et in emotion_types},
        "Вечер": {et: 0 for et in emotion_types},
        "Ночь": {et: 0 for et in emotion_types},
    }
    for tod, etype, cnt in time_of_day_data_raw:
        etype_ru = emotion_type_map.get(etype, etype)
        emotion_time_of_day[tod][etype_ru] = cnt

    emotion_time_of_day_list = []
    for tod in ["Утро", "День", "Вечер", "Ночь"]:
        entry = {"name": tod}
        for et in emotion_types:
            entry[et.capitalize()] = emotion_time_of_day[tod][et]
        emotion_time_of_day_list.append(entry)

    # Энергия — сумма интенсивности по дням недели
    energy_data_raw = db.query(
        func.strftime('%w', EmotionModel.created_at).label('weekday'),
        func.sum(EmotionModel.intensity).label("sum_intensity")
    ).filter(EmotionModel.user_id == user_id).group_by('weekday').all()

    energy_data = []
    day_number_map = {v: k for k, v in day_map.items()}
    for day in days_order:
        wd = day_number_map.get(day)
        intensity_sum = 0
        if wd is not None:
            for raw in energy_data_raw:
                if raw.weekday == wd:
                    intensity_sum = raw.sum_intensity or 0
                    break
        energy_data.append({"day": day, "count": intensity_sum})

    # Трекер настроения — средняя интенсивность по часу и эмоции
    mood_tracker_raw = db.query(
        func.strftime("%H", EmotionModel.created_at).label("hour"),
        EmotionModel.emotion_type,
        func.avg(EmotionModel.intensity).label("avg_intensity")
    ).filter(EmotionModel.user_id == user_id).group_by("hour", EmotionModel.emotion_type).all()

    mood_tracker_map = defaultdict(lambda: {et: 0 for et in emotion_types})
    for hour, etype, avg_int in mood_tracker_raw:
        etype_ru = emotion_type_map.get(etype, etype)
        time_label = f"{int(hour):02d}:00"  # 00:00, 01:00, ..., 23:00
        mood_tracker_map[time_label][etype_ru] = round(avg_int, 2)

    
    mood_tracker_list = []
    for hour in range(24):
        time_key = f"{hour:02d}:00"
        entry = {"time": time_key}
        for et in emotion_types:
            entry[et.capitalize()] = mood_tracker_map[time_key].get(et, 0)
        mood_tracker_list.append(entry)

    analytics_data = {
        "entriesCount": entries_count,
        "mostCommonSpectrum": most_common,
        "rarestSpectrum": rarest,
        "averageMood": round(avg_mood, 2),
        "averageWordCount": int(avg_word_count),
        "mostEmotionalEvent": {
            "emotion": most_emotional_event.name if most_emotional_event else None,
            "intensity": most_emotional_event.intensity if most_emotional_event else None,
        },
        "moodByDay": mood_by_day_list,
        "emotionCategories": emotion_categories,
        "emotionTimeOfDay": emotion_time_of_day_list,
        "energyData": energy_data,
        "moodTracker": mood_tracker_list,
    }

    print("Analytics data prepared:", analytics_data)  # Для отладки

    return analytics_data
