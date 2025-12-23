// frontend/src/components/Dashboard/Dashboard.jsx
import React from "react";
import DashboardLayout from "./DashboardLayout";

const Dashboard = () => {
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      localStorage.removeItem("uptoskills_token");
      localStorage.removeItem("uptoskills_user");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const storedUser = localStorage.getItem("uptoskills_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2 className="auth-title">Welcome to your Dashboard</h2>
            <p className="auth-subtitle">
              {user
                ? `You are logged in as ${user.fullName} (${user.email})`
                : "You are logged in."}
            </p>
          </div>
          <button className="auth-primary-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div
          style={{
            borderRadius: "16px",
            padding: "1.5rem",
            background: "#f7f9ff",
            border: "1px solid #e2e8ff",
          }}
        >
          <h3 style={{ marginBottom: "0.75rem" }}>Coming soon</h3>
          <p style={{ fontSize: "0.9rem", color: "#4b5563" }}>
            Course cards, progress charts, and AI‑powered recommendations
            will appear here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
