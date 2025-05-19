import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.scss";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [editableFields, setEditableFields] = useState({
    email: false,
    phone: false,
    lastName: false,
    firstName: false,
    middleName: false,
    birthDate: false,
    password: false,
  });

  // Ошибки по полям
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch("http://localhost:8000/user_profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(data.email);
        setPhone(data.phone || "");
        setLastName(data.lastName || "");
        setFirstName(data.firstName || "");
        setMiddleName(data.middleName || "");
        setBirthDate(data.birthDate || "");
      } else {
        console.error("Ошибка получения данных:", data);
      }
    };

    fetchUserData();
  }, []);

  const validators = {
    email: (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone: (val) =>
      /^(\+?\d{7,15})$/.test(val.trim()),
    lastName: (val) =>
      /^[A-Za-zА-Яа-яЁё\s\-]{2,}$/.test(val.trim()),
    firstName: (val) =>
      /^[A-Za-zА-Яа-яЁё\s\-]{2,}$/.test(val.trim()),
    middleName: (val) =>
      val.trim() === "" || /^[A-Za-zА-Яа-яЁё\s\-]{2,}$/.test(val.trim()),
  };

  // Валидация с установкой ошибки
  const validateFieldWithError = (field, value) => {
    if (!validators[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    }
    if (!validators[field](value)) {
      setErrors((prev) => ({ ...prev, [field]: `Поле "${field}" заполнено неверно` }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return true;
    }
  };

  const handleEditClick = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    // Если включаем редактирование — очистим ошибку
    if (!editableFields[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // При вводе сразу валидируем поле
  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    validateFieldWithError(field, e.target.value);
  };

  const handleSaveField = async (field) => {
    let value;
    switch (field) {
      case "email":
        value = email;
        break;
      case "phone":
        value = phone;
        break;
      case "lastName":
        value = lastName;
        break;
      case "firstName":
        value = firstName;
        break;
      case "middleName":
        value = middleName;
        break;
      case "birthDate":
        value = birthDate;
        break;
      case "password":
        value = password;
        break;
      default:
        return;
    }

    if (!validateFieldWithError(field, value)) {
      alert(`Поле "${field}" заполнено неверно! Пожалуйста, исправьте.`);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return;

    const body = {};
    body[field] = value;

    const response = await fetch("http://localhost:8000/update_profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Поле "${field}" успешно обновлено!`);
      setEditableFields((prev) => ({ ...prev, [field]: false }));
      if (field === "password") setPassword("");
    } else {
      alert(
        `Ошибка обновления поля "${field}": ${
          data.detail || data.message || "Неизвестная ошибка"
        }`
      );
    }
  };

  const handleAvatarChange = () => {
    alert("Выберите новый аватар");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  // Рендер input с кнопками и ошибками
  const renderEditableField = (label, value, setValue, field, type = "text") => (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        disabled={!editableFields[field]}
        onChange={handleChange(field, setValue)}
        placeholder={`Введите ${label.toLowerCase()}`}
        className={errors[field] ? "input-error" : ""}
      />
      <button
        className="chgbtn"
        onClick={() => {
          if (editableFields[field]) {
            handleSaveField(field);
          } else {
            handleEditClick(field);
          }
        }}
      >
        {editableFields[field] ? "Сохранить" : "Изменить"}
      </button>
      {errors[field] && <div className="error-message">{errors[field]}</div>}
    </div>
  );

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

          {renderEditableField("Почта", email, setEmail, "email", "email")}
          {renderEditableField("Номер телефона", phone, setPhone, "phone")}
          {renderEditableField("Фамилия", lastName, setLastName, "lastName")}
          {renderEditableField("Имя", firstName, setFirstName, "firstName")}
          {renderEditableField("Отчество", middleName, setMiddleName, "middleName")}
          {renderEditableField("Дата рождения", birthDate, setBirthDate, "birthDate", "date")}
          {renderEditableField("Пароль", password, setPassword, "password", "password")}

          <div className="buttons-container">
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
