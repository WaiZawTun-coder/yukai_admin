"use client";

import { useRouter } from "next/navigation";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="access-container">
      <div className="access-card">
        <h1 className="error-code">403</h1>
        <h2>Access Denied</h2>
        <p>You do not have permission to access this page.</p>

        <button onClick={() => router.push("/")}>Go Back Home</button>
      </div>
    </div>
  );
}
