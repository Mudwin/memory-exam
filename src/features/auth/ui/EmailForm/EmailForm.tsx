import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { emailSchema } from "@/features/auth/model/schemas";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import FormContainer from "@/shared/ui/FormContainer/FormContainer";
import FormLink from "@/shared/ui/FormLink/FormLink";
import FormError from "@/shared/ui/FormError";

interface EmailFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error?: string | null;
  showLoginLink?: boolean;
}

type EmailFormValues = z.infer<typeof emailSchema>;

const EmailForm = ({
  onSubmit,
  isLoading,
  error,
  showLoginLink = true,
}: EmailFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: EmailFormValues) => {
    onSubmit(data.email);
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          id="email"
          type="email"
          placeholder="Введите вашу электронную почту"
          {...register("email")}
          error={errors.email?.message}
        />

        {error && <FormError message={error} />}

        <Button
          buttonType="save"
          type="submit"
          disabled={isLoading || !isValid}
        >
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
