"use client";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [error, setError] = useState("");

  const [errors, setErrors] = useState({});

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setErrors({
        username: !username ? "Username is required." : "",
        password: !password ? "Password is required." : "",
      });
      return;
    }

    try {
      setLoggingIn(true);

      await login({ username, password });
      // make sure login() throws error on failure
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="title">Login To Administration</h1>
        <p className="subtitle">Welcome Back!</p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>ADMIN NAME</label>
          <input
            type="text"
            placeholder="Admin username or email"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
              setErrors((prev) => ({ ...prev, username: "" }));
            }}
          />
          {errors.username && (
            <div className="field-error">{errors.username}</div>
          )}

          <label>PASSWORD</label>

          {/* PASSWORD FIELD WITH MATERIAL ICON */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <LockOutlineRoundedIcon />
              ) : (
                <LockOpenRoundedIcon />
              )}
            </span>
          </div>
          {errors.password && (
            <div className="field-error">{errors.password}</div>
          )}

          <div className="forgot-password">
            <Link href="/forget-password">Forgot Password?</Link>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loggingIn}>
            {loggingIn ? "Logging In..." : "Login"}
          </button>
        </form>

        <footer className="login_footer">
          <img src="./Images/logo.png" alt="Yukai Logo" />
        </footer>
      </div>
    </div>
  );
};

export default Login;
