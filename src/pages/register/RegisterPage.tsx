import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useRegister } from "@/features/auth/register/model/useRegister";
import EmailForm from "@/features/auth/ui/EmailForm/EmailForm";
import CodeForm from "@/features/auth/ui/CodeForm/CodeForm";
import PasswordForm from "@/features/auth/ui/PasswordForm/PasswordForm";

const RegisterPage = () => {
  const { step, isLoading, error, submitEmail, submitCode, submitPassword } =
    useRegister();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "success") {
      navigate("/login", { replace: true });
    }
  }, [step, navigate]);

  return (
    <>
      {step === "email" && (
        <EmailForm
          onSubmit={submitEmail}
          isLoading={isLoading}
          error={error}
          showLoginLink
        />
      )}
      {step === "code" && (
        <CodeForm onSubmit={submitCode} isLoading={isLoading} error={error} />
      )}
      {step === "password" && (
        <PasswordForm
          onSubmit={submitPassword}
          isLoading={isLoading}
          error={error}
        />
      )}
      {step === "success" && <p>Регистрация завершена, перенаправление...</p>}
    </>
  );
};

export default RegisterPage;
