import React, { useState } from "react";
import "./css/navbar.css";
import Login from "../components/Login";
import Register from "../components/Register"; // import Register modal

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img
            src="images/logo.svg"
            alt="Ropani AI Logo"
            className="logo"
          />
        </div>

        <div className="navbar-center">
          <a href="/">Home</a>
          <a href="/land">Land</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>

        <div className="navbar-right">
  {isLoggedIn ? (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  ) : (
    <button
      className="login-btn"
      onClick={() => setIsLoginOpen(true)}
    >
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
