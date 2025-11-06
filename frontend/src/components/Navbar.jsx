import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/navbar.css";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // Listen for login status changes (when user logs in via modal)
  useEffect(() => {
    const checkLogin = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // redirect to landing after logout
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/logo.svg" alt="Ropani AI Logo" className="logo" />
        </div>

        <div className="navbar-center">
          <Link to="/">Home</Link>
          <Link to="/land">Land</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          {isLoggedIn && <Link to="/dashboard">Dashboard</Link>}
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="login-btn" onClick={() => setIsLoginOpen(true)}>
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ✅ Login Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      {/* ✅ Register Modal */}
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
