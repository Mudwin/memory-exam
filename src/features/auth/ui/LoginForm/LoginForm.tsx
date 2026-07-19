import { useState } from "react";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormLink from "@/shared/ui/FormLink/FormLink";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  error?: string | null;
  onForgotPassword: () => void;
}

const LoginForm = ({
  onSubmit,
  isLoading,
  error,
  onForgotPassword,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          id="login-email"
          type="email"
          placeholder="Введите вашу электронную почту"
          value={email}
          onChange={setEmail}
        />
        <Input
          id="login-password"
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={setPassword}
        />
        <Button buttonType="save" type="submit" disabled={isLoading}>
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
