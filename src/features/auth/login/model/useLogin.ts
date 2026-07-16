import { useState } from "react";
import { apiClient } from "@/shared/api/apiClient";
import { useAuth } from "@/entities/user/model/useAuth";

export const useLogin = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.post<{
        accessToken: string;
        user: { email: string; id: string };
      }>("/auth/login", { email, password });

      login(data.user, data.accessToken);
    } catch (error: any) {
      setError(error.response?.data?.error || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login: handleLogin,
    isLoading,
    error,
    resetError: () => setError(null),
  };
};
