import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Login failed");
      }

      // optional: store token in localStorage as well
      if (data.data?.accessToken) {
        localStorage.setItem("uptoskills_token", data.data.accessToken);
      }

      // redirect to dashboard (placeholder route for now)
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <div className="auth-card-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Access your AI learning Journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field-label">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address here"
              className="auth-input"
              required
            />
          </label>

          <label className="auth-field-label">
            Password
            <div className="auth-password-wrapper">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input auth-input-password"
                required
              />
              <span className="auth-eye-icon" aria-hidden="true">
                👁
              </span>
            </div>
          </label>

          <div className="auth-row-between">
            <label className="auth-checkbox-row">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="auth-checkbox-input"
              />
              <span className="auth-checkbox-custom" />
              <span className="auth-checkbox-text">Keep me logged in</span>
            </label>

            <button
              type="button"
              className="auth-text-button"
              onClick={() => console.log("Forgot password")}
            >
              Forgot Password?
            </button>
          </div>

          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <button type="button" className="auth-social-btn google">
            <span className="auth-social-icon">G</span>
            <span>Sign in with Google</span>
          </button>

          <button type="button" className="auth-social-btn apple">
            <span className="auth-social-icon"></span>
            <span>Sign in with Apple</span>
          </button>

          <p className="auth-bottom-text">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="auth-bottom-link">
              Sign Up!
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
