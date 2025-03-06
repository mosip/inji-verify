import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Dashboard from './components/travelPass/Dashboard';
import MainLayout from './components/travelPass/MainLayout';
import PrivateRoute from './components/travelPass/PrivateRoute';
import Login from './components/travelPass/login';

const LoginPage = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const navigate = useNavigate();
  
    const handleLogin = () => {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/dashboard");
    };
  
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
  
    return <Login onLogin={handleLogin} />;
};

function App() {
    useEffect(() => {
        
        localStorage.removeItem("isAuthenticated");
    }, []);

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={<PrivateRoute element={<MainLayout><Dashboard /></MainLayout>} />}
                />
                <Route path="/home" element={<PrivateRoute element={<MainLayout><Home/></MainLayout>}/>} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;
