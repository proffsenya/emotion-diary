import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{7,15}$/; // пример простого паттерна для телефона

    if (!email.trim()) {
      newErrors.email = "Почта обязательна";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Неверный формат почты";
    }

    if (!phone.trim()) {
      newErrors.phone = "Номер телефона обязателен";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Неверный формат телефона";
    }

    if (!birthDate) {
      newErrors.birthDate = "Дата рождения обязательна";
    }

    if (!password) {
      newErrors.password = "Пароль обязателен";
    } else if (password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }

    if (password !== confirm) {
      newErrors.confirm = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, phone, birthDate }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrors({ form: data.detail || "Ошибка регистрации" });
      }
    } catch {
      setErrors({ form: "Ошибка подключения к серверу" });
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          background-color: #121212;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
          background-color: #121212;
        }
        .register-box {
          background: #1e1e2f;
          padding: 40px 50px;
          border-radius: 15px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.5);
          max-width: 400px;
          width: 100%;
          color: #e0e7ff;
        }
        .register-box h2 {
          margin-bottom: 30px;
          color: #c5d0f8;
          font-weight: 700;
          text-align: center;
        }
        label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          color: #a8b9db;
        }
        input {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 5px;
          border: none;
          border-radius: 10px;
          background: #2b2d3d;
          color: #e0e7ff;
          font-size: 16px;
          box-sizing: border-box;
          transition: background 0.3s ease, border-color 0.3s ease;
          border: 2px solid transparent;
        }
        input::placeholder {
          color: #7791c9;
        }
        input:focus {
          outline: none;
          background: #37415c;
          box-shadow: 0 0 8px #7d5f94;
        }
        input.error {
          border-color: #ff7373;
          background: #3b2b2b;
        }
        .error-message {
          color: #ff7373;
          margin-bottom: 15px;
          font-weight: 600;
          font-size: 13px;
        }
        button {
          width: 100%;
          padding: 14px;
          background: #9b4d96;
          border: none;
          border-radius: 12px;
          color: #f0f6ff;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 15px;
        }
        button:hover {
          background: #7d5f94;
        }
        .login-link {
          text-align: center;
          font-size: 15px;
          color: #a8b9db;
          margin-top: 20px;
        }
        .login-link a {
          color: #7da3ff;
          text-decoration: none;
        }
        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="page-container">
        <div className="register-box">
          <h2>Регистрация</h2>
          <form onSubmit={handleSubmit} noValidate>

            <label htmlFor="email">Почта:</label>
            <input
              id="email"
              type="email"
              placeholder="Введите почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error" : ""}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <label htmlFor="phone">Номер телефона:</label>
            <input
              id="phone"
              type="tel"
              placeholder="Введите номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? "error" : ""}
              required
            />
            {errors.phone && <p className="error-message">{errors.phone}</p>}

            <label htmlFor="birthDate">Дата рождения:</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={errors.birthDate ? "error" : ""}
              required
            />
            {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}

            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error" : ""}
              required
            />
            {errors.password && <p className="error-message">{errors.password}</p>}

            <label htmlFor="confirm">Повторите пароль:</label>
            <input
              id="confirm"
              type="password"
              placeholder="Повторите пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={errors.confirm ? "error" : ""}
              required
            />
            {errors.confirm && <p className="error-message">{errors.confirm}</p>}

            {errors.form && <p className="error-message">{errors.form}</p>}

            <button type="submit">Зарегистрироваться</button>
          </form>

          <p className="login-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
