import React, { useState } from "react";
import "./Analytics.scss";
import Navbar from "../Navbar/Navbar";
import Calendar from "./Calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";

// Пример данных
const stats = {
  entriesCount: 13,
  mostCommonSpectrum: "Радость",
  rarestSpectrum: "Грусть",
  averageMood: 7.8,
  averageWordCount: 100,
  mostEmotionalEvent: {
    emotion: "Радость",
    intensity: 9,
  },
  moodByDay: [
    { name: "Понедельник", Грусть: 4, Радость: 3, Гнев: 2, Нейтральное: 1 },
    { name: "Вторник", Грусть: 2, Радость: 5, Гнев: 3, Нейтральное: 1 },
    { name: "Среда", Грусть: 5, Радость: 2, Гнев: 1, Нейтральное: 2 },
    { name: "Четверг", Грусть: 3, Радость: 4, Гнев: 1, Нейтральное: 2 },
    { name: "Пятница", Грусть: 2, Радость: 6, Гнев: 3, Нейтральное: 1 },
    { name: "Суббота", Грусть: 4, Радость: 3, Гнев: 2, Нейтральное: 1 },
    { name: "Воскресенье", Грусть: 3, Радость: 5, Гнев: 1, Нейтральное: 1 },
  ],
  emotionCategories: {
    радость: 35,
    грусть: 28,
    гнев: 15,
    нейтральные: 25,
  },
  emotionIntensity: {
    радость: [
      { time: "09:00", value: 7 },
      { time: "11:00", value: 2 },
      { time: "12:00", value: 6 },
      { time: "15:00", value: 8 },
      { time: "18:00", value: 7 },
      { time: "21:00", value: 6 },
    ],
    грусть: [
      { time: "09:00", value: 6 },
      { time: "12:00", value: 1 },
      { time: "15:00", value: 7 },
      { time: "18:00", value: 6 },
      { time: "21:00", value: 5 },
    ],
    гнев: [
      { time: "09:00", value: 4 },
      { time: "12:00", value: 1 },
      { time: "15:00", value: 5 },
      { time: "18:00", value: 4 },
      { time: "21:00", value: 3 },
    ],
    нейтральные: [
      { time: "09:00", value: 5 },
      { time: "12:00", value: 1 },
      { time: "15:00", value: 6 },
      { time: "18:00", value: 5 },
      { time: "21:00", value: 4 },
    ],
  },
};

const emotionTimeOfDay = [
  { name: "Утро", Грусть: 3, Радость: 5, Гнев: 2, Нейтральное: 1 },
  { name: "День", Грусть: 2, Радость: 4, Гнев: 3, Нейтральное: 3 },
  { name: "Вечер", Грусть: 4, Радость: 6, Гнев: 2, Нейтральное: 2 },
  { name: "Ночь", Грусть: 3, Радость: 5, Гнев: 1, Нейтральное: 2 },
];

// Данные для графиков
const energyData = [
  { day: "Понедельник", count: 5 },
  { day: "Вторник", count: 6 },
  { day: "Среда", count: 4 },
  { day: "Четверг", count: 7 },
  { day: "Пятница", count: 8 },
  { day: "Суббота", count: 6 },
  { day: "Воскресенье", count: 5 },
];

const moodData = [
  { time: "08:00", радость: 1, грусть: 2, гнев: 3, нейтральное: 5 },
  { time: "09:00", радость: 7, грусть: 6, гнев: 4, нейтральное: 5 },
  { time: "11:00", радость: 2},
  { time: "12:00", радость: 6, грусть: 5, гнев: 6, нейтральное: 4 },
  { time: "15:00", радость: 8, грусть: 7, гнев: 5, нейтральное: 6 },
  { time: "18:00", радость: 7, грусть: 6, гнев: 4, нейтральное: 5 },
  { time: "21:00", радость: 6, грусть: 5, гнев: 3, нейтральное: 4 },
];

export default function Analytics() {
  return (
    <div className="analytics-page-wrapper">
      <Navbar />
      <div className="analytics-page">
        <section className="calendar-section">
          <Calendar />
        </section>

        {/* Статистическая информация */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-label">Вы создали запись</div>
            <div className="stat-value">{stats.entriesCount} раз</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Самые частые эмоции</div>
            <div className="stat-value yellow">{stats.mostCommonSpectrum}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Самые редкие эмоции</div>
            <div className="stat-value red">{stats.rarestSpectrum}</div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Среднее настроение</div>
            <div className="stat-value">{stats.averageMood}</div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Самое эмоциональное событие</div>
            <div className="stat-value purple">
              {stats.mostEmotionalEvent.emotion} Интенсивность: {stats.mostEmotionalEvent.intensity}
            </div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Среднее количество слов в записи</div>
            <div className="stat-value">{stats.averageWordCount} слов</div>
          </div>
        </section>

        {/* Графики */}
        <section className="graphs-section">
          {/* График "Эмоции по дням недели" */}
          <div className="graph-card mood-by-day">
            <h3>Эмоции по дням недели</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.moodByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Грусть" stackId="a" fill="#64B5F6" />
                <Bar dataKey="Радость" stackId="a" fill="#FFD54F" />
                <Bar dataKey="Гнев" stackId="a" fill="#E57373" />
                <Bar dataKey="Нейтральное" stackId="a" fill="#81C784" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* График "Эмоции по времени суток" */}
          <div className="graph-card time-of-day">
            <h3>Эмоции по времени суток</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emotionTimeOfDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Грусть" stackId="a" fill="#64B5F6" />
                <Bar dataKey="Радость" stackId="a" fill="#FFD54F" />
                <Bar dataKey="Гнев" stackId="a" fill="#E57373" />
                <Bar dataKey="Нейтральное" stackId="a" fill="#81C784" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* График "Энергия" */}
          <div className="graph-card energy-graph">
            <h3>Энергия</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FFD54F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* График "Трекер настроения" */}
          <div className="graph-card mood-tracker">
            <h3>Трекер настроения</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="радость" stroke="#FFD54F" />
                <Line type="monotone" dataKey="грусть" stroke="#64B5F6" />
                <Line type="monotone" dataKey="гнев" stroke="#E57373" />
                <Line type="monotone" dataKey="нейтральное" stroke="#81C784" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          
        </section>
      </div>
    </div>
  );
}
