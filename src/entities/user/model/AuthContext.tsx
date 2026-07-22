import {
  createContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthContextType, User } from "./types";
import {
  getAccessToken,
  setAccessToken,
  apiClient,
} from "@/shared/api/apiClient";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null && token !== null;

  const login = useCallback((userData: User, accessToken: string) => {
    setAccessToken(accessToken);
    setToken(accessToken);
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setToken(null);
    setUserState(null);
    localStorage.removeItem("mock_refresh_token");
  }, []);

  const setUser = useCallback((userData: User) => {
    setUserState(userData);
  }, []);

  const updateToken = useCallback((newToken: string) => {
    setAccessToken(newToken);
    setToken(newToken);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const savedRefreshToken = localStorage.getItem("mock_refresh_token");
      if (!savedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.post<{
          accessToken: string;
          user: User;
        }>("/auth/refresh");

        setAccessToken(data.accessToken);
        setToken(data.accessToken);
        setUserState(data.user);
      } catch (error) {
        localStorage.removeItem("mock_refresh_token");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser,
        updateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
