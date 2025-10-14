import React, { useState } from "react";
import "./css/login.css";
import { loginUser } from "../utils/api";

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(formData);

    if (data.token) {
      setMessage("✅ Logged in successfully!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data)); // store user info
      onClose();
    } else {
      setMessage("❌ " + (data.error || "Invalid credentials"));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-title">Login To Your Account</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <a href="/forgot-password" className="forgot-password">
            Forget Password?
          </a>

          <button type="submit" className="login-btn">Login</button>
        </form>

        {message && <p className="status-message">{message}</p>}

        <p className="register-text">
          Don’t have an account?{" "}
          <span className="register-link" onClick={onSwitchToRegister}>
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
