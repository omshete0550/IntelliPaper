import { createContext, useContext, useEffect, useState } from "react";
import { api, authConfig } from "../lib/api";

const AuthContext = createContext(null);
const storageKey = "intellipaper-token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!token) { setIsLoading(false); return; }
      try {
        const response = await api.get("/auth/me", authConfig(token));
        setUser(response.data.user);
      } catch {
        localStorage.removeItem(storageKey);
        setToken(null);
      } finally { setIsLoading(false); }
    };
    restoreSession();
  }, [token]);

  const completeAuth = (payload) => {
    localStorage.setItem(storageKey, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };
  const login = async (credentials) => { const response = await api.post("/auth/login", credentials); completeAuth(response.data); };
  const register = async (details) => { const response = await api.post("/auth/register", details); completeAuth(response.data); };
  const logout = () => { localStorage.removeItem(storageKey); setToken(null); setUser(null); };

  const value = { token, user, isLoading, login, register, logout, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This hook is intentionally co-located with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
};
