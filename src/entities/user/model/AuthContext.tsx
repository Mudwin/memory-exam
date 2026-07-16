import { createContext, useState, useCallback, type ReactNode } from "react";
import type { User, AuthContextType } from "./types";
import { getAccessToken, setAccessToken } from "@/shared/api/apiClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserData] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());

  const isAuthenticated = user !== null && token !== null;

  const login = useCallback((userData: User, accessToken: string) => {
    setAccessToken(accessToken);
    setToken(accessToken);
    setUserData(userData);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setToken(null);
    setUserData(null);
    localStorage.removeItem("mock_refresh_token");
  }, []);

  const setUser = useCallback((userData: User) => {
    setUserData(userData);
  }, []);

  const updateToken = useCallback((newToken: string) => {
    setAccessToken(newToken);
    setToken(newToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, setUser, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
