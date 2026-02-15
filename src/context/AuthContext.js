"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBackendUrl } from "../utilities/url";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [accessToken, setAccessToken] = useState();


  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await fetch(getBackendUrl() + "/auth/admin/refresh", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
        });
        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.status) {
          const profileRes = await fetch(getBackendUrl() + "/api/admin/profile", {
            headers: { Authorization: `Bearer ${refreshData.data.access_token}` },
            credentials: "include",
          });
          const profileData = await profileRes.json();
          setAccessToken(refreshData.data.access_token);

          if (profileRes.ok) {
            setUser(profileData.data);
          }
        }
      } catch (err) {
        console.error("Auth initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getBackendUrl() + "/api/adminLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      console.log({ data })

      if (!data.status) throw new Error(data.message || "Login failed");

      setUser(data.data.user || data.data);

      setAccessToken(data.data.accessToken);
      router.push("/");
    } catch (err) {
      setError(err.message);
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(getBackendUrl() + "/auth/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.status) {
        setUser(null);
        router.replace("/login");
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      accessToken,
      isLoggedIn: user != null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);