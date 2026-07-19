import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles";

const enableMocking = async () => {
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("./shared/mocks/browser.ts");

  return worker.start({ onUnhandledRequest: "bypass" });
};

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
