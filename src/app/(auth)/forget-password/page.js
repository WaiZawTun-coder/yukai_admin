"use client";
import { useState } from "react";
import { useApi } from "../../../utilities/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPassword() {
  const apiFetch = useApi();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Replace with your API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      const res = await apiFetch("/auth/admin/forget-password", {
        method: "POST",
        body: { email },
      });

      if (!res.status) {
        setError(res.message || "Failed to send reset link. Please try again.");
        return;
      } else {
        router.push("/setup-password?email=" + encodeURIComponent(email));
      }

      setSuccess("If this email exists, a password reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div>
        <form className="forgot-card" onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <p className="subtitle">
            Enter your email to receive a password reset link.
          </p>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        <div className="forgot-password">
          <Link href="/login">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
