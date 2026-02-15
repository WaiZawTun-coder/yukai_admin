"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Layout({ children }) {
    const { loading, isLoggedIn } = useAuth();
    const router = useRouter();

    if (loading) return <div>Loading...</div>

    if (!loading && isLoggedIn) {
        router.push("/")
        return null;
    }

    return <div>{children}</div>;
}