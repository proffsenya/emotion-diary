import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/record");
    } else {
      setError("Неверные данные");
    }
  };

  return (
    <>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
        }
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
          background-color: #121212; /* Темный фон */
        }
        .login-box {
          background: #1e1e2f; /* Фиолетово-серый фон */
          padding: 40px 50px;
          border-radius: 15px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.5);
          max-width: 400px;
          width: 100%;
          color: #e0e7ff;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .login-box h2 {
          margin-bottom: 30px;
          color: #c5d0f8; /* Светлый текст заголовка */
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
          margin-bottom: 25px;
          border: none;
          border-radius: 10px;
          background: #2b2d3d; /* Фон для инпутов */
          color: #e0e7ff;
          font-size: 16px;
          box-sizing: border-box;
          transition: background 0.3s ease;
        }
        input::placeholder {
          color: #7791c9;
        }
        input:focus {
          outline: none;
          background: #37415c; /* Темнее при фокусе */
          box-shadow: 0 0 8px #7d5f94; /* Светлый фиолетовый при фокусе */
        }
        button {
          width: 100%;
          padding: 14px;
          background: #9b4d96; /* Сиреневый цвет для кнопки */
          border: none;
          border-radius: 12px;
          color: #f0f6ff;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px #7f4f7d;
          transition: background 0.3s ease;
        }
        button:hover {
          background: #7d5f94; /* Темный сиреневый цвет при наведении */
        }
        .error-message {
          color: #ff7373;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
        }
        .register-link {
          text-align: center;
          font-size: 15px;
          color: #a8b9db;
          margin-top: 20px;
        }
        .register-link a {
          color: #7da3ff;
          text-decoration: none;
          font-weight: 700;
        }
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="page-container">
        <div className="login-box">
          <h2>Вход</h2>
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Почта:</label>
            <input
              id="email"
              type="text"
              placeholder="Введите почту"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Пароль:</label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="error-message">{error}</p>}

            <button type="submit">Войти</button>
          </form>

          <p className="register-link">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
