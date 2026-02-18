"use client";

import { useEffect, useState } from "react";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import LockOutlineRoundedIcon from "@mui/icons-material/LockOutlineRounded";
import { useApi } from "../../../utilities/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function PasswordSetup() {
  const apiFetch = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const emailFromUrl = searchParams.get("email") || "";
    const updateEmail = () => {
      setForm((prev) => ({
        ...prev,
        email: emailFromUrl,
      }));
    };

    updateEmail();
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    // OTP validation
    if (!/^[0-9]{8}$/.test(form.otp)) {
      newErrors.otp = "OTP must be exactly 8 digits.";
    }

    // Password validation
    const passwordPattern =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    if (!passwordPattern.test(form.password)) {
      newErrors.password =
        "Password must be 8+ characters, include 1 number & 1 special character.";
    }

    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      alert("Password successfully updated!");
      // Call backend API here

      const res = await apiFetch("/auth/admin/setup-password", {
        method: "POST",
        body: form,
      });

      if (res.status) {
        alert(res.message || "Password successfully updated!");
        router.push("/login");
      } else {
        alert(res.message || "Failed to setup Password. Please try again.");
      }
    }
  };

  return (
    <div className="password-container">
      <form className="password-card" onSubmit={handleSubmit}>
        <h2>Set New Password</h2>

        <div className="input-group">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
          />
          {errors.otp && <p className="error">{errors.otp}</p>}
        </div>

        <div className="input-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <LockOutlineRoundedIcon />
              ) : (
                <LockOpenRoundedIcon />
              )}
            </span>
          </div>

          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="input-group">
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <span
              className="password-eye"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <LockOutlineRoundedIcon />
              ) : (
                <LockOpenRoundedIcon />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
