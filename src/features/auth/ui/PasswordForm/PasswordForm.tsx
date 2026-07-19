import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordSchema } from "@/features/auth/model/schemas";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormError from "@/shared/ui/FormError/FormError";

interface PasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
  error?: string | null;
}

type PasswordFormValues = z.infer<typeof passwordSchema>;

const PasswordForm = ({ onSubmit, isLoading, error }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: PasswordFormValues) => {
    onSubmit(data.password);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          id="password"
          type="password"
          placeholder="Введите пароль"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          id="confirm-password"
          type="password"
          placeholder="Повторите пароль"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {error && <FormError message={error} />}

        <Button
          buttonType="save"
          type="submit"
          disabled={isLoading || !isValid}
        >
          Сохранить
        </Button>
      </form>
    </FormContainer>
  );
};

export default PasswordForm;
