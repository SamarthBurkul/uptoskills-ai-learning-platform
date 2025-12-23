// frontend/src/components/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import "./auth.css";
import { auth, googleProvider, signInWithPopup } from "../firebase";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [showPassword, setShowPassword] = useState(false);
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

  const persistAuth = (data) => {
    if (data?.accessToken) {
      localStorage.setItem("uptoskills_token", data.accessToken);
    }
    if (data?.user) {
      localStorage.setItem("uptoskills_user", JSON.stringify(data.user));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Login failed");
      }

      persistAuth(json.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/oauth-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ provider: "google", idToken }),
        }
      );

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.message || "Login failed");
      }

      persistAuth(json.data);
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

        <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
          <label className="auth-field-label">
            Email Address
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address here"
              className="auth-input"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field-label">
            Password
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input auth-input-password"
                autoComplete="current-password"
                required
              />
              <span
                className="auth-eye-icon"
                aria-hidden="true"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: "pointer", fontSize: 12, marginLeft: 8 }}
              >
                {showPassword ? "Hide" : "Show"}
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

          {error && (
            <p style={{ color: "red", fontSize: 12 }}>{error}</p>
          )}

          <button
            type="submit"
            className="auth-primary-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <button
            type="button"
            className="auth-social-btn google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="auth-social-icon">G</span>
            <span>Sign in with Google</span>
          </button>

          <button
            type="button"
            className="auth-social-btn apple"
            disabled
          >
            <span className="auth-social-icon"></span>
            <span>Sign in with Apple (coming soon)</span>
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
