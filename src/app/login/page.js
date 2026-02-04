"use client";
import { useState } from "react";
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import LockOutlineRoundedIcon from '@mui/icons-material/LockOutlineRounded';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-card">

        <img
          src="./Images/line logo.png"
          alt="Decoration"
          className="decor-image"
        />

        <h1 className="title">Login To Administration</h1>
        <p className="subtitle">Welcome Back!</p>

        <form className="login-form">
          <label>ADMIN NAME</label>
          <input type="text" placeholder="Name" />

          <label>PASSWORD</label>

          {/* PASSWORD FIELD WITH MATERIAL ICON */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <LockOutlineRoundedIcon /> : <LockOpenRoundedIcon />}
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <footer className="login_footer">
          <img src="./Images/logo.png" alt="Yukai Logo" />
        </footer>

      </div>
    </div>
  );
};

export default Login;
