"use client";

import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "../AccessDenied";

export default function Layout({ children }) {
  const { loading, isLoggedIn, user: authUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading)
    return (
      <div className="auth-loader">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );

  if (!loading && !isLoggedIn) {
    router.push("/login");
    return null;
  }

  if (
    authUser.role !== "super_admin" &&
    pathname.startsWith("/admin-management")
  ) {
    return <AccessDenied />;
  }

  return (
    <div className="layout">
      <AdminSidebar />
      {children}
    </div>
  );
}
