import { useState } from "react";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import styles from "./CodeForm.module.css";

interface CodeFormProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: string | null;
  timerText?: string;
  onResend?: () => void;
}

const CodeForm = ({
  onSubmit,
  isLoading,
  error,
  timerText,
  onResend,
}: CodeFormProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Input
          id="code"
          type="text"
          placeholder="Введите код подтверждения, присланный на почту"
          value={code}
          onChange={setCode}
        />
        <Button buttonType="save" type="submit" disabled={isLoading}>
          {isLoading ? "Проверка..." : "Подтвердить"}
        </Button>
        {timerText && <p className={styles.timer}>{timerText}</p>}
      </form>
    </FormContainer>
  );
};

export default CodeForm;
