import React from "react";
import "./css/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="images/logo.svg"
          alt="Ropani AI Logo"
          className="logo"
        />
        {/* <span className="brand">Ropani AI</span> */}
      </div>
      <div className="navbar-center">
        <a href="/">Home</a>
        <a href="/land">Land</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact Us</a>
      </div>
      <div className="navbar-right">
        <button className="login-btn">Login</button>
      </div>
    </nav>
  );
}
