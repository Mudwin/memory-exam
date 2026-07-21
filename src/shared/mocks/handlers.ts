import { http, HttpResponse } from "msw";

const STORAGE_KEY_USERS = "msw_users";
const STORAGE_KEY_REFRESH = "mock_refresh_token";

const loadUsers = (): Map<string, { email: string; password?: string }> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);

    if (raw) {
      const parsed = JSON.parse(raw);
      return new Map(Object.entries(parsed));
    }
  } catch (error) {}

  return new Map();
};

const saveUsers = (
  users: Map<string, { email: string; password?: string }>,
) => {
  const obj = Object.fromEntries(users);

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(obj));
};

let users = loadUsers();

const registrationCodes = new Map<string, string>();
const resetCodes = new Map<string, string>();

const verifiedEmails = new Set<string>();

const generateCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const handlers = [
  http.post("/api/auth/register-email", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (!email) {
      return HttpResponse.json({ error: "Email обязателен" }, { status: 400 });
    }

    const code = generateCode();
    registrationCodes.set(email, code);
    console.log(`Код регистрации для ${email}: ${code}`);

    return HttpResponse.json(
      { message: `Код успешно отправлен на почту: ${email}` },
      { status: 200 },
    );
  }),

  http.post("/api/auth/verify-code", async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email: string;
      code: string;
    };

    let isValid = false;

    if (registrationCodes.has(email) && registrationCodes.get(email) === code) {
      isValid = true;
    } else if (resetCodes.has(email) && resetCodes.get(email) === code) {
      isValid = true;
    }

    if (!isValid) {
      return HttpResponse.json(
        { error: "Неверный код подтверждения" },
        { status: 400 },
      );
    }

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

    if (!password || password.length < 8) {
      return HttpResponse.json(
        { error: "Пароль должен быть не менее 8 символов" },
        { status: 403 },
      );
    }

    users.set(email, { email, password });
    saveUsers(users);
    verifiedEmails.delete(email);
    registrationCodes.delete(email);

    console.log(`Новый пользователь зарегистрирован: ${email}`);

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

    if (!users.has(email)) {
      return HttpResponse.json(
        { error: "Пользователь с таким email не найден" },
        { status: 404 },
      );
    }

    const code = generateCode();
    resetCodes.set(email, code);
    console.log(`Код восстановления для ${email}: ${code}`);

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

    const savedCode = resetCodes.get(email);

    if (!savedCode || savedCode !== code) {
      return HttpResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    const user = users.get(email);

    if (!user) {
      return HttpResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return HttpResponse.json(
        { error: "Пароль не менее 8 символов" },
        { status: 400 },
      );
    }

    user.password = newPassword;
    users.set(email, user);
    saveUsers(users);
    resetCodes.delete(email);
    verifiedEmails.delete(email);

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

    localStorage.setItem(STORAGE_KEY_REFRESH, fakeRefreshToken);

    return HttpResponse.json(
      {
        accessToken: fakeAccessToken,
        user: { email: user.email, id: "user-id" },
      },
      { status: 200 },
    );
  }),

  http.post("/api/auth/refresh", async () => {
    const savedRefreshToken = localStorage.getItem(STORAGE_KEY_REFRESH);

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
