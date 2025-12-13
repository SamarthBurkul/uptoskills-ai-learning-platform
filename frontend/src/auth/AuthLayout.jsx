import React from "react";
import "./auth.css";
import logo from "../assets/uptoskills-logo.png";
import robot from "../assets/Robot-Logo.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-left">
        <img src={logo} alt="UptoSkills logo" className="auth-logo-img" />

        <div className="auth-heading-block">
          <h1 className="auth-heading-line1">
            AI <span>Learning</span>
          </h1>
          <h1 className="auth-heading-line2">Platform</h1>
        </div>

        <p className="auth-left-text">
          Unlock the future of education with AI‑powered courses
          designed to accelerate your learning journey.
        </p>

        <img src={robot} alt="AI learning illustration" className="auth-robot-img" />
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
