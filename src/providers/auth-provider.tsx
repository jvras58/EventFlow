"use client"

import * as React from "react"
import { use } from "react"

interface AuthUser {
  id: string;
  email: string;
  nome?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  token: string | null;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = React.useState(true);

  const decodeToken = (jwtToken: string) => {
    try {
      const payloadBase64 = jwtToken.split('.')[1];
      const decodedInfo = JSON.parse(atob(payloadBase64));
      return { id: decodedInfo.userId, email: decodedInfo.email, nome: decodedInfo.nome };
    } catch (error) {
      return null;
    }
  };

  React.useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    }

    let storedToken = getCookie("auth_token");
    if (!storedToken) {
      storedToken = localStorage.getItem("auth_token");
      if (storedToken) {
        document.cookie = `auth_token=${storedToken}; path=/; max-age=86400; secure; samesite=strict`;
        localStorage.removeItem("auth_token");
      }
    }

    if (storedToken) {
      const decoded = decodeToken(storedToken);
      if (decoded) {
        setToken(storedToken);
        setUser(decoded);
      } else {
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    setIsInitializing(false);
  }, []);

  const login = (newToken: string) => {
    const decoded = decodeToken(newToken);
    if (decoded) {
      document.cookie = `auth_token=${newToken}; path=/; max-age=86400; secure; samesite=strict`;
      setToken(newToken);
      setUser(decoded);
    }
  };

  const logout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext value={{ isAuthenticated: !!token, isInitializing, token, user, login, logout }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
