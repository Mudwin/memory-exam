import { useState, useEffect } from "react";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import styles from "./CodeForm.module.css";

interface CodeFormProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: string | null;
  onResend: () => void;
}

const CodeForm = ({ onSubmit, isLoading, error, onResend }: CodeFormProps) => {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendable, setIsResendable] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setIsResendable(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");

    return `${mm}:${ss}`;
  };

  const handleResend = () => {
    onResend?.();
    setTimer(60);
    setIsResendable(false);
  };

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
          Подтвердить
        </Button>
        <div className={styles.resendContainer}>
          {!isResendable ? (
            <span className={styles.timer}>
              Отправить код повторно через {formatTime(timer)}
            </span>
          ) : (
            <button
              type="button"
              className={styles.resendLink}
              onClick={handleResend}
            >
              Отправить код повторно
            </button>
          )}
        </div>
      </form>
    </FormContainer>
  );
};

export default CodeForm;
