import React, { useState } from "react";
import "./css/login.css";
import { registerUser } from "../utils/api";

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(formData);

    if (data.token) {
      setMessage("✅ Account created successfully!");
      localStorage.setItem("token", data.token);
      onClose(); // close modal automatically
    } else {
      setMessage("❌ " + (data.error || "Something went wrong"));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2 className="modal-title">Create An Account</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            name="full_name"
            type="text"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            name="phone_number"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />

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

          <button type="submit" className="login-btn">Create Account</button>
        </form>

        {message && <p className="status-message">{message}</p>}

        <p className="register-text">
          Already have an account?{" "}
          <span className="register-link" onClick={onSwitchToLogin}>
            Login Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
