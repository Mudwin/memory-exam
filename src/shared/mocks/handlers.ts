import { http, HttpResponse } from "msw";

const STORAGE_KEY_USERS = "msw_users";
const STORAGE_KEY_REFRESH = "mock_refresh_token";
const STORAGE_KEY_SETS = "msw_sets";
const STORAGE_KEY_OBJECTS = "msw_objects";
const STORAGE_KEY_SETTINGS = "msw_set_settings";

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

const loadSets = (): Map<string, any> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETS);

    if (raw) {
      const parsed = JSON.parse(raw);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {}

  return new Map();
};

const saveSets = (sets: Map<string, any>) => {
  const obj = Object.fromEntries(sets);
  localStorage.setItem(STORAGE_KEY_SETS, JSON.stringify(obj));
};

const loadObjects = (): Map<string, any> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OBJECTS);

    if (raw) {
      const parsed = JSON.parse(raw);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {}

  return new Map();
};

const saveObjects = (objects: Map<string, any>) => {
  const obj = Object.fromEntries(objects);
  localStorage.setItem(STORAGE_KEY_OBJECTS, JSON.stringify(obj));
};

const loadSettings = (): Map<string, any> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);

    if (raw) {
      const parsed = JSON.parse(raw);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {}

  return new Map();
};

const saveSettings = (settings: Map<string, any>) => {
  const obj = Object.fromEntries(settings);
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(obj));
};

let sets = loadSets();
let objects = loadObjects();
let publicSettings = loadSettings();

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

const getCurrentUserFromRequest = (request: Request): string | null => {
  const authHeader = request.headers.get("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    const match = token.match(/fake-access-token-for-(.+?)-/);
    if (match) {
      return match[1];
    }
  }

  return null;
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

  http.get("/api/sets", async ({ request }) => {
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSets = Array.from(sets.values()).filter(
      (s) => s.ownerId === email,
    );

    return HttpResponse.json(userSets, { status: 200 });
  }),

  http.post("/api/sets", async ({ request }) => {
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      title: string;
      description?: string;
      visibility: string;
    };

    if (!body.title) {
      return HttpResponse.json(
        { error: "Название обязательно" },
        { status: 400 },
      );
    }

    const newSet = {
      id: generateId(),
      title: body.title,
      description: body.description || "",
      visibility: body.visibility || "private",
      ownerId: email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      objectCount: 0,
    };

    sets.set(newSet.id, newSet);
    saveSets(sets);

    publicSettings.set(newSet.id, {
      allowCards: true,
      allowTests: true,
      allowExam: true,
      allowAnswers: false,
      requireAuth: false,
    });

    saveSettings(publicSettings);

    return HttpResponse.json(newSet, { status: 201 });
  }),

  http.get("/api/sets/:id", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set) {
      return HttpResponse.json({ error: "Набор не найден" }, { status: 404 });
    }

    if (set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const setObjects = Array.from(objects.values()).filter(
      (o) => o.setId === id,
    );

    const result = {
      ...set,
      objects: setObjects,
      objectCount: setObjects.length,
    };

    return HttpResponse.json(result, { status: 200 });
  }),

  http.put("/api/sets/:id", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set) {
      return HttpResponse.json({ error: "Набор не найден" }, { status: 404 });
    }

    if (set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      visibility?: string;
    };

    if (body.title !== undefined) set.title = body.title;
    if (body.description !== undefined) set.description = body.description;
    if (body.visibility !== undefined) set.visibility = body.visibility;

    set.updatedAt = new Date().toISOString();

    sets.set(set.id, set);
    saveSets(sets);

    return HttpResponse.json(set, { status: 200 });
  }),

  http.delete("/api/sets/:id", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set) {
      return HttpResponse.json({ error: "Набор не найден" }, { status: 404 });
    }

    if (set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const toDelete = Array.from(objects.keys()).filter((key) => {
      const obj = objects.get(key);
      return obj && obj.setId === id;
    });

    toDelete.forEach((key) => objects.delete(key));

    sets.delete(id as string);
    saveSets(sets);
    saveObjects(objects);
    publicSettings.delete(id as string);
    saveSettings(publicSettings);

    return HttpResponse.json({ message: "Набор удалён" }, { status: 200 });
  }),

  http.get("/api/sets/:id/public", async ({ params }) => {
    const { id } = params;
    const set = sets.get(id as string);

    if (!set) {
      return HttpResponse.json({ error: "Набор не найден" }, { status: 404 });
    }

    if (set.visibility !== "public") {
      return HttpResponse.json(
        { error: "Набор не публичный" },
        { status: 403 },
      );
    }

    const setObjects = Array.from(objects.values()).filter(
      (o) => o.setId === id,
    );

    const result = {
      ...set,
      objects: setObjects,
      objectCount: setObjects.length,
    };

    return HttpResponse.json(result, { status: 200 });
  }),

  http.get("/api/sets/:id/public-settings", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set || set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const settings = publicSettings.get(id as string) || {
      allowCards: true,
      allowTests: true,
      allowExam: true,
      allowAnswers: false,
      requireAuth: false,
    };

    return HttpResponse.json(settings, { status: 200 });
  }),

  http.put("/api/sets/:id/public-settings", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set || set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = (await request.json()) as {
      allowCards: boolean;
      allowTests: boolean;
      allowExam: boolean;
      allowAnswers: boolean;
      requireAuth: boolean;
    };

    publicSettings.set(id as string, body);
    saveSettings(publicSettings);

    return HttpResponse.json(body, { status: 200 });
  }),

  http.get("/api/sets/:id/objects", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    const set = sets.get(id as string);
    if (!set) {
      return HttpResponse.json({ error: "Набор не найден" }, { status: 404 });
    }

    if (set.visibility === "private") {
      if (!email || set.ownerId !== email) {
        return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
      }
    }

    const setObjects = Array.from(objects.values()).filter(
      (o) => o.setId === id,
    );

    return HttpResponse.json(setObjects, { status: 200 });
  }),

  http.post("/api/sets/:id/objects", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const set = sets.get(id as string);
    if (!set || set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const formData = await request.formData();
    const fieldsRaw = formData.get("fields") as string;
    const imageFile = formData.get("image") as File | null;

    let fields = [];

    try {
      fields = JSON.parse(fieldsRaw);
    } catch (err) {
      return HttpResponse.json(
        { error: "Неверный формат полей" },
        { status: 400 },
      );
    }

    const newObject = {
      id: generateId(),
      setId: id as string,
      fields: fields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    objects.set(newObject.id, newObject);
    saveObjects(objects);

    const setObjects = Array.from(objects.values()).filter(
      (o) => o.setId === id,
    );

    set.objectCount = setObjects.length;
    sets.set(set.id, set);
    saveSets(sets);

    return HttpResponse.json(newObject, { status: 201 });
  }),

  http.put("/api/objects/:id", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const object = objects.get(id as string);
    if (!object) {
      return HttpResponse.json({ error: "Объект не найден" }, { status: 404 });
    }

    const set = sets.get(object.setId);
    if (!set || set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const formData = await request.formData();
    const fieldsRaw = formData.get("fields") as string | null;

    if (fieldsRaw) {
      try {
        const fields = JSON.parse(fieldsRaw);
        object.fields = fields;
      } catch (err) {
        return HttpResponse.json(
          { error: "Неверный формат полей" },
          { status: 400 },
        );
      }
    }

    object.updatedAt = new Date().toISOString();
    objects.set(object.id, object);
    saveObjects(objects);

    return HttpResponse.json(object, { status: 200 });
  }),

  http.delete("/api/objects/:id", async ({ params, request }) => {
    const { id } = params;
    const email = getCurrentUserFromRequest(request);

    if (!email) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const object = objects.get(id as string);
    if (!object) {
      return HttpResponse.json({ error: "Объект не найден" }, { status: 404 });
    }

    const set = sets.get(object.setId);
    if (!set || set.ownerId !== email) {
      return HttpResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    objects.delete(id as string);
    saveObjects(objects);

    const setObjects = Array.from(objects.values()).filter(
      (o) => o.setId === object.setId,
    );

    set.objectCount = setObjects.length;
    sets.set(set.id, set);
    saveSets(sets);

    return HttpResponse.json({ message: "Объект удалён" }, { status: 200 });
  }),

  http.get("/api/objects/:id/image", async () => {
    return HttpResponse.json(
      { error: "заглушка, не реализуется через MSW" },
      { status: 501 },
    );
  }),
];
