import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/auth/register-email", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    console.log(`Код для подтверждения регистрации почты ${email}: 111222`);

    return HttpResponse.json(
      {
        message: `Код успешно отправлен на почту: ${email}`,
      },
      {
        status: 200,
      },
    );
  }),
];
