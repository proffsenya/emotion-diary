import React, { useEffect, useState, useRef } from "react";
import "./Analytics.scss";
import Navbar from "../Navbar/Navbar";
import Calendar from "./Calendar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // useRef для хранения ID интервала, чтобы потом его очистить
  const intervalId = useRef(null);

  async function fetchAnalytics() {
    if (!token) {
      setError("Пользователь не авторизован");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/analytics", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Ошибка загрузки данных");
      }
      const data = await response.json();
      setStats(data);
      console.log("Analytics data:", data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    
  }

  useEffect(() => {
    fetchAnalytics();

    // Запускаем поллинг каждые 15 секунд
    intervalId.current = setInterval(() => {
      fetchAnalytics();
    }, 15000);

    // Очистка интервала при размонтировании
    return () => clearInterval(intervalId.current);
  }, [token]);

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!stats) return null;

  return (
    <div className="analytics-page-wrapper">
      <Navbar />
      <div className="analytics-page">
        <section className="calendar-section">
          <Calendar />
        </section>

        {/* Статистика */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-label">Вы создали запись</div>
            <div className="stat-value">{stats.entriesCount} раз</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Самые частые эмоции</div>
            <div className="stat-value yellow">{stats.mostCommonSpectrum || "-"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Самые редкие эмоции</div>
            <div className="stat-value red">{stats.rarestSpectrum || "-"}</div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Среднее настроение</div>
            <div className="stat-value">{stats.averageMood}</div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Самое эмоциональное событие</div>
            <div className="stat-value purple">
              {stats.mostEmotionalEvent.emotion || "-"} <br></br> Интенсивность:{" "}
              {stats.mostEmotionalEvent.intensity || "-"}
            </div>
          </div>
          <div className="stat-card full-width">
            <div className="stat-label">Среднее количество слов в записи</div>
            <div className="stat-value">{stats.averageWordCount} слов</div>
          </div>
        </section>

        {/* Графики */}
        <section className="graphs-section">
  {/* Эмоции по дням недели */}
  <div className="graph-card mood-by-day">
    <h3>Эмоции по дням недели</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.moodByDay}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Грусть" stackId="a" fill="#64B5F6" />
        <Bar dataKey="Радость" stackId="a" fill="#FFD54F" />
        <Bar dataKey="Гнев" stackId="a" fill="#E57373" />
        <Bar dataKey="Нейтральное" stackId="a" fill="#81C784" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Эмоции по времени суток */}
  <div className="graph-card time-of-day">
    <h3>Эмоции по времени суток</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.emotionTimeOfDay}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Грусть" stackId="a" fill="#64B5F6" />
        <Bar dataKey="Радость" stackId="a" fill="#FFD54F" />
        <Bar dataKey="Гнев" stackId="a" fill="#E57373" />
        <Bar dataKey="Нейтральное" stackId="a" fill="#81C784" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Энергия — теперь маленький блок */}
  <div className="graph-card energy-graph">
    <h3>Энергия</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats.energyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#FFD54F" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Статистика по категориям — маленький блок */}
  <div className="graph-card emotion-categories">
    <h3>Эмоциональная статистика по категориям</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={[stats.emotionCategories]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="радость" fill="#FFD54F" />
        <Bar dataKey="грусть" fill="#64B5F6" />
        <Bar dataKey="гнев" fill="#E57373" />
        <Bar dataKey="нейтральное" fill="#81C784" />
      </BarChart>
    </ResponsiveContainer>
  </div>
  {/* Трекер настроения — во всю ширину */}
  <div className="graph-card mood-tracker full-width">
    <h3>Трекер настроения</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={stats.moodTracker}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Радость" stroke="#FFD54F" />
        <Line type="monotone" dataKey="Грусть" stroke="#64B5F6" />
        <Line type="monotone" dataKey="Гнев" stroke="#E57373" />
        <Line type="monotone" dataKey="Нейтральное" stroke="#81C784" />
      </LineChart>
    </ResponsiveContainer>
  </div>
</section>


      </div>
    </div>
  );
}
