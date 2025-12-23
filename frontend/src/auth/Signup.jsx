import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      fullName: form.username,
      email: form.email,
      password: form.password,
    }),
  }
);

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Signup failed");
      }

      // on success go to login (or dashboard if you want)
      navigate("/login");
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
          <h2 className="auth-title">Join Us Today!</h2>
          <p className="auth-subtitle">
            Create your account for an enhanced experience at your fingertips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field-label">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email here"
              className="auth-input"
              required
            />
          </label>

          <label className="auth-field-label">
            Choose a Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username here"
              className="auth-input"
              required
            />
          </label>

          <label className="auth-field-label">
            Create a Password
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

          <div className="auth-minimum-note">
            <span className="auth-lock-icon">🔒</span>
            <span>Minimum 8 characters required</span>
          </div>

          {error && <p style={{ color: "red", fontSize: 12 }}>{error}</p>}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
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
            Already have an account?{" "}
            <a href="/login" className="auth-bottom-link">
              Log In!
            </a>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
