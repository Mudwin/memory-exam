import { useState } from "react";
import { apiClient } from "@/shared/api/apiClient";

type Step = "email" | "code" | "newPassword" | "success";

export const useForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEmail = async (inputEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/forgot-password", { email: inputEmail });

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
    setCode(code);

    try {
      await apiClient.post("/auth/verify-code", { email, code });
      setStep("newPassword");
    } catch (error: any) {
      setError(error.response?.data?.error || "Неверный код");
    } finally {
      setIsLoading(false);
    }
  };

  const submitNewPassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      setStep("success");
    } catch (error: any) {
      setError(error.response?.data?.error || "Ошибка сохранения пароля");
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
    submitNewPassword,
    resetError: () => setError(null),
  };
};
