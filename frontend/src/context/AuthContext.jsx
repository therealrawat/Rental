import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authApi, setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "landlord_app_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(auth) {
  if (!auth) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthToken(auth?.token);
  }, [auth?.token]);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setAuth(data);
      writeStoredAuth(data);
      toast.success("Welcome back");
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password, role });
      setAuth(data);
      writeStoredAuth(data);
      toast.success("Account created");
      return data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    const newAuth = { ...auth, user: updatedUser };
    setAuth(newAuth);
    writeStoredAuth(newAuth);
  };

  const logout = () => {
    setAuth(null);
    writeStoredAuth(null);
    setAuthToken(null);
    toast.success("Logged out");
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      loading,
      login,
      register,
      logout,
      updateUser
    }),
    [auth?.token, auth?.user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
