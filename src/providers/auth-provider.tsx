"use client"

import * as React from "react"

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);

  const decodeToken = (jwtToken: string) => {
    try {
      const payloadBase64 = jwtToken.split('.')[1];
      const decodedInfo = JSON.parse(atob(payloadBase64));
      return { id: decodedInfo.userId, email: decodedInfo.email };
    } catch (error) {
      return null;
    }
  };

  React.useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  const login = (newToken: string) => {
    const decoded = decodeToken(newToken);
    if (decoded) {
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);
      setUser(decoded);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
