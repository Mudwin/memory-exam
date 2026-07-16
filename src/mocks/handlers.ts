import { http, HttpResponse } from "msw";

const verificationCodes = new Map<string, string>();

const verifiedEmails = new Set<string>();

const users = new Map<string, { email: string; password?: string }>();

export const handlers = [
  http.post("/api/auth/register-email", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return HttpResponse.json({ error: "Email обязателен" }, { status: 400 });
    }

    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes.set(email, generatedCode);

    console.log(`Код для подтверждения почты ${email}: ${generatedCode}`);

    return HttpResponse.json(
      {
        message: `Код успешно отправлен на почту: ${email}`,
      },
      {
        status: 200,
      },
    );
  }),

  http.post("/api/auth/verify-code", async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email: string;
      code: string;
    };

    const savedCode = verificationCodes.get(email);

    if (!savedCode || savedCode !== code) {
      return HttpResponse.json(
        { error: "Неверный код подтверждения" },
        { status: 400 },
      );
    }

    verificationCodes.delete(email);
    verifiedEmails.add(email);

    return HttpResponse.json(
      { message: "Код успешно подтвержден" },
      { status: 200 },
    );
  }),

  http.post("/api/auth/register-password", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    if (!verifiedEmails.has(email)) {
      return HttpResponse.json(
        { error: `Почта ${email} не подтверждена` },
        { status: 403 },
      );
    }

    if (!password || password.length < 6) {
      return HttpResponse.json(
        { error: "Пароль должен быть не менее 6 символов" },
        { status: 403 },
      );
    }

    users.set(email, { email, password });
    verifiedEmails.delete(email);

    console.log(
      `Новый пользователь зарегистрирован. Всего пользователей: ${users.size}`,
    );

    return HttpResponse.json(
      { message: "Регистрация завершена" },
      { status: 201 },
    );
  }),

  http.post("/api/auth/forgot-password", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return HttpResponse.json(
        { error: "Для восстановления пароля нужен email" },
        { status: 400 },
      );
    }

    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes.set(email, generatedCode);

    console.log(`Код для сброса пароля: ${generatedCode}`);

    return HttpResponse.json(
      { message: "Код успешно отправлен" },
      { status: 200 },
    );
  }),

  http.post("/api/auth/reset-password", async ({ request }) => {
    const { email, code, newPassword } = (await request.json()) as {
      email: string;
      code: string;
      newPassword: string;
    };

    const savedCode = verificationCodes.get(email);

    if (!savedCode || savedCode !== code) {
      return HttpResponse.json({ error: "Неверный код" }, { status: 4000 });
    }

    const user = users.get(email);

    if (!user) {
      return HttpResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return HttpResponse.json(
        { error: "Пароль не менее 6 символов" },
        { status: 400 },
      );
    }

    user.password = newPassword;
    verificationCodes.delete(email);

    return HttpResponse.json({ message: "Пароль обновлен" }, { status: 200 });
  }),

  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    const user = users.get(email);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { error: "Неверная почта или пароль" },
        { status: 400 },
      );
    }

    const fakeAccessToken = `fake-access-token-for-${email}-${Date.now()}`;
    const fakeRefreshToken = `fake-refresh-token-for-${email}-${Date.now()}`;

    localStorage.setItem("mock_refresh_token", fakeRefreshToken);

    return HttpResponse.json(
      {
        accessToken: fakeAccessToken,
        user: { email: user.email, id: "user-id" },
      },
      { status: 200 },
    );
  }),

  http.post("/api/auth/refresh", async () => {
    const savedRefreshToken = localStorage.getItem("mock_refresh_token");

    if (!savedRefreshToken) {
      return HttpResponse.json(
        { error: "Пользователь не авторизован" },
        { status: 401 },
      );
    }

    const email = savedRefreshToken.split("-for-")[1]?.split("-")[0] || "";

    const newAccessToken = `fake-access-token-for-${email}-${Date.now()}`;

    return HttpResponse.json(
      { accessToken: newAccessToken, user: { email: email, id: "user-id" } },
      { status: 200 },
    );
  }),
];
