import React, { useState } from "react";
import './Calendar.scss';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Дни недели
  const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  // Пример данных о эмоциях
  const emotionsData = [
    { day: 1, emotions: [{ name: "Радость", color: "#FFD54F", intensity: 8 }, { name: "Грусть", color: "#64B5F6", intensity: 3 }] },
    { day: 2, emotions: [{ name: "Грусть", color: "#64B5F6", intensity: 7 }] },
    { day: 3, emotions: [{ name: "Радость", color: "#FFD54F", intensity: 9 }] },
    { day: 5, emotions: [{ name: "Гнев", color: "#F44336", intensity: 6 }] },
    { day: 7, emotions: [{ name: "Нейтральное", color: "#81C784", intensity: 5 }] },
    // и так далее...
  ];

  // Функция для изменения месяца
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Функция для получения дней в месяце
  const getDaysInMonth = () => {
    const daysInMonth = [];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Дни недели до начала месяца
    const startDay = firstDayOfMonth.getDay();

    // Добавление пустых дней перед началом месяца
    for (let i = 0; i < startDay; i++) {
      daysInMonth.push(null);
    }

    // Добавление дней месяца
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      daysInMonth.push(i);
    }

    return daysInMonth;
  };

  // Функция для получения эмоций для конкретного дня
  const getEmotionsForDay = (day) => {
    const dayEmotions = emotionsData.find(item => item.day === day);
    return dayEmotions ? dayEmotions.emotions : [];
  };

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
            const emotionsForDay = getEmotionsForDay(day);

            // Применение стилей для дней с эмоциями
            const dayStyles = emotionsForDay.length
              ? { background: `linear-gradient(90deg, ${emotionsForDay.map(emotion => emotion.color).join(', ')})` }
              : {};

            return (
              <div key={index} className={`calendar-day ${day ? '' : 'empty'}`} style={day ? dayStyles : {}}>
                {day || ''}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
