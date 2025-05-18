import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import AnalyticsComponent from "./components/AnalyticsComponent/Analytics";
import RecordPage from "./components/RecordPage/RecordPage";
import UserProfileComponent from "./components/UserProfileComponent/ProfilePage";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
function Layout({ children }) {

  return (
    <>

      <main
      >
        {children}
      </main>
    </>
  );
}


function PrivateRoute({ children }) {
  const { user } = useAuth();
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
            <Route path="/record" element={<RecordPage />} />
            <Route path="/profile" element={<PrivateRoute><UserProfileComponent /></PrivateRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
