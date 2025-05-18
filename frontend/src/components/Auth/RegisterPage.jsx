import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    const success = register(username, password, email, phone, birthDate);
    if (success) {
      navigate("/login");
    } else {
      setError("Ошибка регистрации");
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
          color: #e0e7ff;
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
          margin-bottom: 25px;
          border: none;
          border-radius: 10px;
          background: #2b2d3d;
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
          background: #37415c;
          box-shadow: 0 0 8px #7d5f94;
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
          box-shadow: 0 4px 12px #7f4f7d;
          transition: background 0.3s ease;
        }
        button:hover {
          background: #7d5f94;
        }
        .error-message {
          color: #ff7373;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 600;
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
          font-weight: 700;
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
              required
            />

            <label htmlFor="phone">Номер телефона:</label>
            <input
              id="phone"
              type="tel"
              placeholder="Введите номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label htmlFor="birthDate">Дата рождения:</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
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

            <label htmlFor="confirm">Повторите пароль:</label>
            <input
              id="confirm"
              type="password"
              placeholder="Повторите пароль"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && <p className="error-message">{error}</p>}

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
