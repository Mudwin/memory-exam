import { useState } from "react";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import FormLink from "@/shared/ui/FormLink/FormLink";

interface EmailFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error?: string | null;
  showLoginLink?: boolean;
}

const EmailForm = ({
  onSubmit,
  isLoading,
  error,
  showLoginLink = true,
}: EmailFormProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          placeholder="Введите вашу электронную почту"
          value={email}
          onChange={setEmail}
        />
        <Button buttonType="save" type="submit" disabled={isLoading}>
          Получить код
        </Button>
        {showLoginLink && (
          <FormLink
            text="У меня уже есть аккаунт"
            linkText="Войти"
            to="/login"
          />
        )}
      </form>
    </FormContainer>
  );
};

export default EmailForm;
