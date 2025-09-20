import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthModal = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {/* Demo buttons on landing page */}
      <button onClick={() => setShowLogin(true)}>Open Login</button>
      <button onClick={() => setShowRegister(true)}>Open Register</button>

      <Login
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <Register
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </div>
  );
};

export default AuthModal;
