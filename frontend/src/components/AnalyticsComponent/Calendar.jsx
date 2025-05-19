import React, { useState, useEffect } from "react";
import './Calendar.scss';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [emotionDays, setEmotionDays] = useState([]);

  const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  // Функция для смены месяца
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Получить дни в месяце
  const getDaysInMonth = () => {
    const daysInMonth = [];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const startDay = firstDayOfMonth.getDay();

    for (let i = 0; i < startDay; i++) {
      daysInMonth.push(null);
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysInMonth.push(i);
    }

    return daysInMonth;
  };

  // Получить цвет для дня, если он есть в данных с бэка
  const getColorForDay = (day) => {
    const dayData = emotionDays.find(item => item.day === day);
    return dayData ? dayData.color : null;
  };

  // Загрузка дней с эмоциями с backend
  useEffect(() => {
    const fetchEmotionDays = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JS month с 0, API с 1

        const response = await fetch(`http://localhost:8000/emotion_days?year=${year}&month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Ошибка загрузки данных эмоций');
        }

        const data = await response.json();
        setEmotionDays(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmotionDays();
  }, [currentDate]);

  const days = getDaysInMonth();

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <span>{currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>
      <div className="calendar-body">
        <div className="calendar-weekdays">
          {weekdays.map((day, index) => (
            <div key={index} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day, index) => {
            const color = day ? getColorForDay(day) : null;
            const dayStyle = color ? { backgroundColor: color } : {};
            return (
              <div
                key={index}
                className={`calendar-day ${day ? "" : "empty"}`}
                style={dayStyle}
              >
                {day || ""}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
