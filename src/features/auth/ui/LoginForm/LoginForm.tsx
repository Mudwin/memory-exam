import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/features/auth/model/schemas";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormLink from "@/shared/ui/FormLink/FormLink";
import FormError from "@/shared/ui/FormError/FormError";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
  onForgotPassword: () => void;
}

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({
  onSubmit,
  isLoading,
  error,
  onForgotPassword,
}: LoginFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: LoginFormValues) => {
    onSubmit(data.email, data.password);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          id="login-email"
          type="email"
          placeholder="Введите вашу электронную почту"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          id="login-password"
          type="password"
          placeholder="Введите пароль"
          {...register("password")}
          error={errors.password?.message}
        />

        {error && <FormError message={error} />}

        <Button
          buttonType="save"
          type="submit"
          disabled={isLoading || !isValid}
        >
          Войти
        </Button>

        <div className={styles.links}>
          <FormLink
            text="У меня нет аккаунта"
            linkText="Зарегистрироваться"
            to="/register"
          />

          <button
            type="button"
            className={styles.forgotLink}
            onClick={onForgotPassword}
          >
            Забыли пароль?
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
