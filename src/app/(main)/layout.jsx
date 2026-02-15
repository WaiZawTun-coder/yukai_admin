"use client"

import { useRouter } from "next/navigation";
import AdminSidebar from "../../Components/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Layout({ children }) {
  const { loading, isLoggedIn } = useAuth();
  const router = useRouter();

  console.log({ loading, isLoggedIn })

  if (loading) return <div>Loading...</div>

  if (!loading && !isLoggedIn) {
    router.push("/login");
    return null;
  }

  return (
    <div className="layout">
      <AdminSidebar />
      {children}
    </div>
  );
}