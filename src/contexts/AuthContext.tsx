import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("auth-logged-in") === "true";
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    localStorage.setItem("auth-logged-in", "true");
    setShowLoginDialog(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("auth-logged-in");
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, showLoginDialog, setShowLoginDialog }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
