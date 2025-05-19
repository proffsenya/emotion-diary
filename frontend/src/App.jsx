import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AnalyticsComponent from "./components/AnalyticsComponent/Analytics";
import RecordPage from "./components/RecordPage/RecordPage";
import UserProfileComponent from "./components/UserProfileComponent/ProfilePage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout компонент
function Layout({ children }) {
  return <main>{children}</main>;
}

// Компонент для защищённого маршрута
function PrivateRoute({ children }) {
  const { user } = useAuth();
  // Если пользователь есть, показываем контент, иначе перенаправляем на страницу входа
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Защищённые маршруты */}
            <Route path="/analytics" element={<PrivateRoute><AnalyticsComponent /></PrivateRoute>} />
            <Route path="/record" element={<PrivateRoute><RecordPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><UserProfileComponent /></PrivateRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
