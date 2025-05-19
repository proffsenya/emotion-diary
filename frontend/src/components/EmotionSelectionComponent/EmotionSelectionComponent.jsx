import React, { useState } from "react";

const EmotionSelectionComponent = ({ emotion, comment, setComment, intensity, setIntensity, onClose }) => {
  const [errors, setErrors] = useState({});

  async function handleSave() {
    const newErrors = {};
    if (!comment.trim()) {
      newErrors.comment = "Комментарий не может быть пустым";
    }
    const intensityValue = Number(intensity);
    if (!intensityValue || intensityValue < 1 || intensityValue > 10) {
      newErrors.intensity = "Интенсивность должна быть от 1 до 10";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return; // Есть ошибки — не отправляем запрос
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert("Пожалуйста, войдите в систему");
        return;
      }

      const requestData = {
        emotion_type: emotion.type,
        name: emotion.name,
        intensity: intensityValue,
        comment: comment.trim(),
      };

      const response = await fetch('http://localhost:8000/add_emotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Эмоция успешно сохранена!");
        onClose();
      } else {
        alert(`Ошибка: ${data.detail || "Не удалось сохранить эмоцию"}`);
      }
    } catch (error) {
      alert("Ошибка при сохранении эмоции.");
    }
  }

  return (
    <div style={modalStyles}>
      <div style={{ ...emotionBoxStyles, backgroundColor: emotion.color }}>
        <h5 style={emotionTextStyles}>{emotion.name}</h5>
      </div>

      <div style={labelStyles}>Комментарий</div>
      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Опишите то, что вы чувствуете"
        style={{ 
          ...inputStyles, 
          borderColor: errors.comment ? "#ff7373" : inputStyles.borderColor 
        }}
        autoFocus
      />
      {errors.comment && <div style={{ color: "#ff7373", marginBottom: "10px", textAlign: "left" }}>{errors.comment}</div>}

      <div style={labelStyles}>Интенсивность</div>
      <input
        type="range"
        min="1"
        max="10"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
        style={{
          ...rangeInputStyles,
          outlineColor: errors.intensity ? "#ff7373" : "none",
          boxShadow: errors.intensity ? "0 0 6px #ff7373" : "none"
        }}
      />
      <div style={rangeValueStyles}>{intensity}</div>
      {errors.intensity && <div style={{ color: "#ff7373", marginBottom: "10px", textAlign: "left" }}>{errors.intensity}</div>}

      <button style={saveButtonStyles} onClick={handleSave}>
        Сохранить
      </button>

      <button style={closeButtonStyles} onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
};

// -- стили оставляем без изменений --
const modalStyles = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#1e1e2f",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.5)",
  width: "100%",
  maxWidth: "500px",
  color: "#e0e7ff",
  textAlign: "center",
  zIndex: 1000,
};

const emotionBoxStyles = {
  borderRadius: "12px",
  padding: "50px 20px",
  marginBottom: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const emotionTextStyles = {
  margin: 0,
  color: "#fff",
  fontWeight: "600",
  fontSize: "22px",
};

const labelStyles = {
  textAlign: "left",
  fontSize: "16px",
  color: "#a8b9db",
  marginBottom: "10px",
  marginTop: "10px",
};

const inputStyles = {
  width: "100%",
  padding: "12px 15px",
  marginBottom: "20px",
  borderRadius: "10px",
  background: "#2b2d3d",
  color: "#e0e7ff",
  fontSize: "16px",
  border: "1px solid #9b4d96",
  outline: "none",
  resize: "none",
  transition: "background 0.3s ease, border-color 0.3s ease",
  boxSizing: "border-box",
};

const rangeInputStyles = {
  width: "100%",
  height: "6px",
  borderRadius: "5px",
  background: "#9b4d96",
  appearance: "none",
  outline: "none",
  marginBottom: "10px",
};

const rangeValueStyles = {
  color: "#e0e7ff",
  fontSize: "16px",
  textAlign: "center",
};

const saveButtonStyles = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#9b4d96",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 12px #7f4f7d",
  transition: "background 0.3s ease, box-shadow 0.3s ease",
  marginTop: "60px",
};

const closeButtonStyles = {
  width: "100%",
  padding: "12px",
  background: "none",
  color: "#a8b9db",
  fontSize: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
  transition: "background 0.3s ease, box-shadow 0.3s ease",
};

export default EmotionSelectionComponent;
