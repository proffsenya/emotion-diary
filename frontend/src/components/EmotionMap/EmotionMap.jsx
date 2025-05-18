import React, { useState, useRef, useEffect } from "react";
import EmotionSelectionComponent from "../EmotionSelectionComponent/EmotionSelectionComponent";


// Массив из 100 эмоций с типами и цветами
const emotions = [
  // Радостные (joy)
  { id: 1, name: "Радость", type: "joy", color: "#FFD54F" },
  { id: 2, name: "Восторг", type: "joy", color: "#FFEB3B" },
  { id: 3, name: "Благодарность", type: "joy", color: "#FFF176" },
  { id: 4, name: "Улыбка", type: "joy", color: "#FFEE58" },
  { id: 5, name: "Оптимизм", type: "joy", color: "#FFF59D" },
  { id: 6, name: "Веселье", type: "joy", color: "#FFE082" },
  { id: 7, name: "Вдохновение", type: "joy", color: "#FFCA28" },
  { id: 8, name: "Любовь", type: "joy", color: "#FFD740" },
  { id: 9, name: "Надежда", type: "joy", color: "#FFE57F" },
  { id: 10, name: "Счастье", type: "joy", color: "#FFF176" },
  { id: 11, name: "Удовольствие", type: "joy", color: "#FFEB3B" },
  { id: 12, name: "Воодушевление", type: "joy", color: "#FFEE58" },
  { id: 13, name: "Покой", type: "joy", color: "#FFF59D" },
  { id: 14, name: "Восхищение", type: "joy", color: "#FFE082" },
  { id: 15, name: "Бодрость", type: "joy", color: "#FFCA28" },
  { id: 16, name: "Удовлетворение", type: "joy", color: "#FFD740" },
  { id: 17, name: "Лёгкость", type: "joy", color: "#FFE57F" },
  { id: 18, name: "Обожание", type: "joy", color: "#FFF176" },
  { id: 19, name: "Жизнерадостность", type: "joy", color: "#FFEB3B" },
  { id: 20, name: "Эйфория", type: "joy", color: "#FFEE58" },

  // Грустные (sadness)
  { id: 21, name: "Грусть", type: "sadness", color: "#64B5F6" },
  { id: 22, name: "Тоска", type: "sadness", color: "#42A5F5" },
  { id: 23, name: "Печаль", type: "sadness", color: "#2196F3" },
  { id: 24, name: "Одиночество", type: "sadness", color: "#1E88E5" },
  { id: 25, name: "Сожаление", type: "sadness", color: "#1976D2" },
  { id: 26, name: "Ностальгия", type: "sadness", color: "#1565C0" },
  { id: 27, name: "Потеря", type: "sadness", color: "#0D47A1" },
  { id: 28, name: "Меланхолия", type: "sadness", color: "#82B1FF" },
  { id: 29, name: "Безнадёжность", type: "sadness", color: "#448AFF" },
  { id: 30, name: "Уныние", type: "sadness", color: "#2979FF" },
  { id: 31, name: "Разочарование", type: "sadness", color: "#2962FF" },
  { id: 32, name: "Печалька", type: "sadness", color: "#1E3A8A" },
  { id: 33, name: "Жалость", type: "sadness", color: "#5472D3" },
  { id: 34, name: "Унылость", type: "sadness", color: "#0D47A1" },
  { id: 35, name: "Тоска по дому", type: "sadness", color: "#4A90E2" },
  { id: 36, name: "Печаль души", type: "sadness", color: "#1976D2" },
  { id: 37, name: "Печаль сердца", type: "sadness", color: "#1565C0" },
  { id: 38, name: "Печаль любви", type: "sadness", color: "#0D47A1" },
  { id: 39, name: "Печаль утраты", type: "sadness", color: "#0D47A1" },
  { id: 40, name: "Печаль безысходности", type: "sadness", color: "#0D47A1" },

  // Гневные (anger)
  { id: 41, name: "Злость", type: "anger", color: "#E57373" },
  { id: 42, name: "Раздражение", type: "anger", color: "#EF5350" },
  { id: 43, name: "Ненависть", type: "anger", color: "#F44336" },
  { id: 44, name: "Гнев", type: "anger", color: "#D32F2F" },
  { id: 45, name: "Ярость", type: "anger", color: "#C62828" },
  { id: 46, name: "Обида", type: "anger", color: "#B71C1C" },
  { id: 47, name: "Злоба", type: "anger", color: "#FF8A80" },
  { id: 48, name: "Нетерпимость", type: "anger", color: "#FF5252" },
  { id: 49, name: "Враждебность", type: "anger", color: "#FF1744" },
  { id: 50, name: "Гневливость", type: "anger", color: "#D50000" },
  { id: 51, name: "Возмущение", type: "anger", color: "#B71C1C" },
  { id: 52, name: "Недовольство", type: "anger", color: "#C62828" },
  { id: 53, name: "Негодование", type: "anger", color: "#D32F2F" },
  { id: 54, name: "Раздражительность", type: "anger", color: "#EF5350" },
  { id: 55, name: "Злорадство", type: "anger", color: "#F44336" },
  { id: 56, name: "Вспыльчивость", type: "anger", color: "#C62828" },
  { id: 57, name: "Обострение", type: "anger", color: "#B71C1C" },
  { id: 58, name: "Взрыв гнева", type: "anger", color: "#D32F2F" },
  { id: 59, name: "Гнев на себя", type: "anger", color: "#EF5350" },
  { id: 60, name: "Гнев на других", type: "anger", color: "#E53935" },

  // Нейтральные (neutral)
  { id: 61, name: "Спокойствие", type: "neutral", color: "#81C784" },
  { id: 62, name: "Расслабленность", type: "neutral", color: "#66BB6A" },
  { id: 63, name: "Уверенность", type: "neutral", color: "#4CAF50" },
  { id: 64, name: "Баланс", type: "neutral", color: "#43A047" },
  { id: 65, name: "Нейтральность", type: "neutral", color: "#388E3C" },
  { id: 66, name: "Покой", type: "neutral", color: "#2E7D32" },
  { id: 67, name: "Равновесие", type: "neutral", color: "#81C784" },
  { id: 68, name: "Безразличие", type: "neutral", color: "#66BB6A" },
  { id: 69, name: "Миролюбие", type: "neutral", color: "#4CAF50" },
  { id: 70, name: "Сдержанность", type: "neutral", color: "#43A047" },
  { id: 71, name: "Невозмутимость", type: "neutral", color: "#388E3C" },
  { id: 72, name: "Тишина", type: "neutral", color: "#2E7D32" },
  { id: 73, name: "Покой души", type: "neutral", color: "#81C784" },
  { id: 74, name: "Примирение", type: "neutral", color: "#66BB6A" },
  { id: 75, name: "Терпимость", type: "neutral", color: "#4CAF50" },
  { id: 76, name: "Уравновешенность", type: "neutral", color: "#43A047" },
  { id: 77, name: "Понимание", type: "neutral", color: "#388E3C" },
  { id: 78, name: "Объективность", type: "neutral", color: "#2E7D32" },
  { id: 79, name: "Доброжелательность", type: "neutral", color: "#81C784" },
  { id: 80, name: "Рассудительность", type: "neutral", color: "#66BB6A" },
  { id: 81, name: "Энергия", type: "joy", color: "#FFD54F" },
  { id: 82, name: "Задор", type: "joy", color: "#FFEB3B" },
  { id: 83, name: "Восхищение", type: "joy", color: "#FFF176" },
  { id: 84, name: "Облегчение", type: "joy", color: "#FFEE58" },
  { id: 85, name: "Позитив", type: "joy", color: "#FFF59D" },
  { id: 86, name: "Смех", type: "joy", color: "#FFE082" },
  { id: 87, name: "Оптимизм", type: "joy", color: "#FFCA28" },
  { id: 88, name: "Трепет", type: "joy", color: "#FFD740" },
  { id: 89, name: "Завораживание", type: "joy", color: "#FFE57F" },
  { id: 90, name: "Любопытство", type: "joy", color: "#FFF176" },
  { id: 91, name: "Умиление", type: "sadness", color: "#64B5F6" },
  { id: 92, name: "Печалька", type: "sadness", color: "#42A5F5" },
  { id: 93, name: "Скорбь", type: "sadness", color: "#2196F3" },
  { id: 94, name: "Жалость", type: "sadness", color: "#1E88E5" },
  { id: 95, name: "Разочарование", type: "sadness", color: "#1976D2" },
  { id: 96, name: "Печаль сердца", type: "sadness", color: "#1565C0" },
  { id: 97, name: "Недовольство", type: "anger", color: "#E57373" },
  { id: 98, name: "Враждебность", type: "anger", color: "#EF5350" },
  { id: 99, name: "Гнев", type: "anger", color: "#F44336" },
  { id: 100, name: "Беспокойство", type: "neutral", color: "#81C784" },
];

const EMOTION_SIZE = 150; // Размер квадрата
const FIXED_MAP_WIDTH = 2800; // Фиксированная ширина карты
const FIXED_MAP_HEIGHT = 2000; // Фиксированная высота карты
const FIXED_PADDING_X = 60; // Отступы
const FIXED_PADDING_Y = 60;

const SECTORS = {
  joy: "leftTop",
  sadness: "rightTop",
  anger: "leftBottom",
  neutral: "rightBottom",
};

function getSectorPosition(index, sector) {
  const cols = 6;
  const rows = 4;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const halfW = FIXED_MAP_WIDTH / 2;
  const halfH = FIXED_MAP_HEIGHT / 2;
  const cellWidth = EMOTION_SIZE + FIXED_PADDING_X;
  const cellHeight = EMOTION_SIZE + FIXED_PADDING_Y;

  let baseX = 0;
  let baseY = 0;

  switch (sector) {
    case "leftTop":
      baseX = FIXED_PADDING_X + col * cellWidth;
      baseY = FIXED_PADDING_Y + row * cellHeight;
      break;
    case "rightTop":
      baseX = halfW + FIXED_PADDING_X + col * cellWidth;
      baseY = FIXED_PADDING_Y + row * cellHeight;
      break;
    case "leftBottom":
      baseX = FIXED_PADDING_X + col * cellWidth;
      baseY = FIXED_MAP_HEIGHT * 0.55 + FIXED_PADDING_Y + row * cellHeight;
      break;
    case "rightBottom":
      baseX = halfW + FIXED_PADDING_X + col * cellWidth;
      baseY = FIXED_MAP_HEIGHT * 0.55 + FIXED_PADDING_Y + row * cellHeight;
      break;
  }

  return { baseX, baseY };
}

