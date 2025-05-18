import React, { useState, useRef } from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { FaUser } from "react-icons/fa";
import "./ProfilePage.scss";

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleSave = () => {
    // логика сохранения данных
    alert('Сохранено');
  };

  const handleAvatarChange = () => {
    // логика для смены аватара
    alert('Выберите новый аватар');
  };

  return (
    <>
    <Navbar />
    <div className="page-container">
      
      <div className="profile-box">
        <h2>Редактировать профиль</h2>

        <div className="avatar-section" onClick={handleAvatarChange}>
          {avatar ? (
            <img src={avatar} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">Аватар</div>
          )}
          <div className="avatar-instruction">
            Нажмите на аватар, чтобы загрузить новое фото
          </div>
        </div>

        <div className="input-group">
          <label>Почта</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Номер телефона</label>
          <input
            type="text"
            placeholder="Введите номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Фамилия</label>
          <input
            type="text"
            placeholder="Введите фамилию"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Имя</label>
          <input
            type="text"
            placeholder="Введите имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Отчество</label>
          <input
            type="text"
            placeholder="Введите отчество"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Дата рождения</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <div className="input-group">
          <label>Пароль</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="chgbtn">Изменить</button>
        </div>

        <button className="submit-btn" onClick={handleSave}>Сохранить</button>
      </div>
    </div>
    </>
  );
  
};
