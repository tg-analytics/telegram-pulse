import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import type { AuthSession } from "@/services/authApi";
import { clearStoredSession, getStoredSession, setStoredSession } from "@/services/authStorage";

interface AuthContextType {
  isLoggedIn: boolean;
  session: AuthSession | null;
  login: () => void;
  loginWithSession: (session: AuthSession) => void;
  logout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [mockLoggedIn, setMockLoggedIn] = useState(() => {
    return localStorage.getItem("auth-logged-in") === "true";
  });
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const login = useCallback(() => {
    setMockLoggedIn(true);
    localStorage.setItem("auth-logged-in", "true");
    setShowLoginDialog(false);
  }, []);

  const loginWithSession = useCallback((nextSession: AuthSession) => {
    setSession(nextSession);
    setStoredSession(nextSession);
    localStorage.removeItem("auth-logged-in");
    setMockLoggedIn(false);
    setShowLoginDialog(false);
  }, []);

  const logout = useCallback(() => {
    setMockLoggedIn(false);
    setSession(null);
    localStorage.removeItem("auth-logged-in");
    clearStoredSession();
  }, []);

  const isLoggedIn = useMemo(() => mockLoggedIn || !!session, [mockLoggedIn, session]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        session,
        login,
        loginWithSession,
        logout,
        showLoginDialog,
        setShowLoginDialog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
