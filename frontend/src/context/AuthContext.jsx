import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("clf_user")) || null; } catch { return null; } });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("clf_token")));
  useEffect(() => {
    if (!localStorage.getItem("clf_token")) { setLoading(false); return; }
    getCurrentUser().then(data => { setUser(data.user); localStorage.setItem("clf_user", JSON.stringify(data.user)); })
      .catch(() => { localStorage.removeItem("clf_token"); localStorage.removeItem("clf_user"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  const login = data => { localStorage.setItem("clf_token", data.token); localStorage.setItem("clf_user", JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem("clf_token"); localStorage.removeItem("clf_user"); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
