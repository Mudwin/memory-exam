import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { codeSchema } from "@/features/auth/model/schemas";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import FormError from "@/shared/ui/FormError/FormError";
import styles from "./CodeForm.module.css";

interface CodeFormProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
  error?: string | null;
  onResend: () => void;
}

type CodeFormValues = z.infer<typeof codeSchema>;

const CodeForm = ({ onSubmit, isLoading, error, onResend }: CodeFormProps) => {
  const [timer, setTimer] = useState(60);
  const [isResendable, setIsResendable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: CodeFormValues) => {
    onSubmit(data.code);
  };

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

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          id="code"
          type="text"
          placeholder="Введите код подтверждения"
          {...register("code")}
          error={errors.code?.message}
        />

        {error && <FormError message={error} />}

        <Button
          buttonType="save"
          type="submit"
          disabled={isLoading || !isValid}
        >
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
