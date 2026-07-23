import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles";

const baseUrl = import.meta.env.BASE_URL;

const enableMocking = async () => {
  const { worker } = await import("./shared/mocks/browser.ts");

  return worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: `${baseUrl}mockServiceWorker.js`,
    },
  });
};

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
