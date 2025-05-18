import React from "react";

const EmotionSelectionComponent = ({ emotion, comment, setComment, intensity, setIntensity, onClose }) => {
  const handleSave = () => {
    alert(`Комментарий для эмоции "${emotion.name}": ${comment}\nИнтенсивность: ${intensity}`);
    onClose(); // Закрытие модала
  };

  return (
    <div style={modalStyles}>
      <div style={{ ...emotionBoxStyles, backgroundColor: emotion.color }}>
        <h5 style={emotionTextStyles}>{emotion.name}</h5>
      </div>

      <div style={labelStyles}>Комментарий</div>
      <textarea
        id="comment"
        value={comment} // Используем переданный комментарий
        onChange={(e) => setComment(e.target.value)} // Обновляем комментарий
        placeholder="Опишите то, что вы чувствуете"
        style={inputStyles}
        autoFocus // Добавлено для фокуса на поле ввода
      />

      {/* Интенсивность эмоции */}
      <div style={labelStyles}>Интенсивность</div>
      <input
        type="range"
        min="1"
        max="10"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
        style={rangeInputStyles}
      />
      <div style={rangeValueStyles}>{intensity}</div>

      <button style={saveButtonStyles} onClick={handleSave}>
        Сохранить
      </button>

      <button style={closeButtonStyles} onClick={onClose}>
        Закрыть
      </button>
    </div>
  );
};



export default EmotionSelectionComponent;
