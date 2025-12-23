import React from "react";
import "../auth/auth.css"; // reuse fonts/colors etc.

const DashboardLayout = ({ children }) => {
  return (
    <div className="auth-page">
      {/* Left side reused as a sidebar */}
      <div className="auth-left">
        <h1 className="auth-heading-line1">
          AI <span>Learning</span>
        </h1>
        <h1 className="auth-heading-line2">Dashboard</h1>
        <p className="auth-left-text">
          Track your courses, progress, and recommendations.
        </p>
      </div>

      {/* Right content */}
      <div className="auth-right">{children}</div>
    </div>
  );
};

export default DashboardLayout;
