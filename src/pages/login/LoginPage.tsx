import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/entities/user/model/useAuth";
import { useLogin } from "@/features/auth/login/model/useLogin";
import { useForgotPassword } from "@/features/auth/forgot-password/model/useForgotPassword";
import LoginForm from "@/features/auth/ui/LoginForm/LoginForm";
import EmailForm from "@/features/auth/ui/EmailForm/EmailForm";
import CodeForm from "@/features/auth/ui/CodeForm/CodeForm";
import PasswordForm from "@/features/auth/ui/PasswordForm/PasswordForm";

type LoginMode = "login" | "forgot";

const LoginPage = () => {
  const [mode, setMode] = useState<LoginMode>("login");
  const loginHook = useLogin();
  const forgotHook = useForgotPassword();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleForgotPassword = () => setMode("forgot");

  useEffect(() => {
    if (mode === "forgot" && forgotHook.step === "success") {
      setMode("login");
    }
  }, [forgotHook.step, mode]);

  if (mode === "forgot") {
    const {
      step,
      isLoading,
      error,
      submitEmail,
      submitCode,
      submitNewPassword,
    } = forgotHook;

    if (step === "success") {
      setMode("login");
      return null;
    }

    return (
      <>
        {step === "email" && (
          <EmailForm
            onSubmit={submitEmail}
            isLoading={isLoading}
            error={error}
            showLoginLink={false}
          />
        )}
        {step === "code" && (
          <CodeForm onSubmit={submitCode} isLoading={isLoading} error={error} />
        )}
        {step === "newPassword" && (
          <PasswordForm
            onSubmit={submitNewPassword}
            isLoading={isLoading}
            error={error}
          />
        )}
      </>
    );
  }

  return (
    <LoginForm
      onSubmit={loginHook.login}
      isLoading={loginHook.isLoading}
      error={loginHook.error}
      onForgotPassword={handleForgotPassword}
    />
  );
};

export default LoginPage;
