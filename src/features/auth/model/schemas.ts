import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email обязателен").email("Некорректный email"),
});

export const codeSchema = z.object({
  code: z
    .string()
    .length(4, "Код должен содержать 4 цифры")
    .regex(/^\d{4}$/, "Код должен состоять только из цифр"),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Пароль должен быть не менее 8 символов")
      .regex(
        /^[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
        "Пароль может содержать только буквы, цифры и спецсимволы",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});
