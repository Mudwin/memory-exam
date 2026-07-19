import { useState } from "react";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import styles from "./PasswordForm.module.css";

interface PasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const PasswordForm = ({ onSubmit, isLoading, error }: PasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatchError, setMismatchError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMismatchError(true);
      return;
    }
    setMismatchError(false);
    onSubmit(password);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          id="password"
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={setPassword}
        />
        <Input
          id="confirm-password"
          type="password"
          placeholder="Повторите пароль"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        {mismatchError && <p className={styles.error}>Пароли не совпадают</p>}
        {error && <p className={styles.error}>{error}</p>}
        <Button buttonType="save" type="submit" disabled={isLoading}>
          Сохранить
        </Button>
      </form>
    </FormContainer>
  );
};

export default PasswordForm;
