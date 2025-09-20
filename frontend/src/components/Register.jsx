import React from "react";
import "./css/login.css"; // reuse same styles as login

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Close button */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <h2 className="modal-title">Create An Account</h2>

        {/* Registration Form */}
        <form className="modal-form">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" required />

          <label>Phone Number</label>
          <input type="tel" placeholder="Enter your phone number" required />

          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <button type="submit" className="login-btn">
            Create Account
          </button>
        </form>

        {/* Switch back to Login */}
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
