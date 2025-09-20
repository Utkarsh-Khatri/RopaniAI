import React from "react";
import "./css/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section */}
        <div className="footer-column">
          <img
            src="/images/logo.svg"
            alt="Ropani AI Logo"
            className="footer-logo"
          />
          <p className="brand">Ropani AI</p>
          <p>Sunway College, Maitidevi,</p>
          <p>Kathmandu, Nepal, 44600</p>
        </div>

        {/* Middle Section */}
        <div className="footer-column">
          <h4>ABOUT US</h4>
          <p>
            Ropani AI makes land prices transparent. We help buyers and sellers
            compare government rates with market prices, ensuring fair and
            trusted deals.
          </p>
        </div>

        {/* Right Section */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>+977 11111111</p>
          <p>+977 0000000000</p>
          <p>ropaniAI@gmail.com</p>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="footer-bottom">
        <p>Copyright ©2025 RopaniAI.com. All Rights Reserved</p>
      </div>
    </footer>
  );
}
