import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаём контекст для аутентификации
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Проверка наличия токена в localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      // Если токен есть, можно добавить проверку его валидности
      // Например, можно добавить код для декодирования JWT и проверки срока его действия
      setUser({ token });
    }
  }, []);

  const login = (token) => {
    // Сохраняем токен в localStorage
    localStorage.setItem('access_token', token);
    setUser({ token });
  };

  const logout = () => {
    // Удаляем токен из localStorage
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
