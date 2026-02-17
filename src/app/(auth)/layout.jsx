"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { loading, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push("/");
    }
  }, [loading, isLoggedIn, router]);

  if (loading) {
    return (
      <div className="auth-loader">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!loading && isLoggedIn) {
    return null;
  }

  return <div>{children}</div>;
}
