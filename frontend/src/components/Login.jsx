import React from "react";
import "./css/login.css";

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">Login To Your Account</h2>

        <form className="modal-form">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" required />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />

          <a href="/forgot-password" className="forgot-password">
            Forget Password?
          </a>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

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
