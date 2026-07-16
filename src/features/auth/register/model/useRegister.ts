import { useState } from "react";
import { apiClient } from "@/shared/api/apiClient";

type Step = "email" | "code" | "password" | "success";

export const useRegister = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/register-email", { email: inputEmail });
      setEmail(inputEmail);
      setStep("code");
    } catch (error: any) {
      setError(error.response?.data?.error || "Ошибка отправки кода");
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/verify-code", { email, code });
      setStep("password");
    } catch (error: any) {
      setError(error.response?.data?.error || "Неверный код");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async (password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/register-password", { email, password });
      setStep("success");
    } catch (error: any) {
      setError(error.response?.data?.error || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    step,
    email,
    isLoading,
    error,
    submitEmail,
    submitCode,
    submitPassword,
    resetError: () => setError(null),
  };
};
