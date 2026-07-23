import { createContext, useContext, type ReactNode } from "react";
import { useToast } from "@/shared/lib/useToast";
import Toast from "@/shared/ui/Toast/Toast";

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(
      "useToastContext должен использоваться внутри ToastProvider",
    );
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toasts, showToast, removeToast } = useToast();

  const showSuccess = (message: string) => showToast(message, "success");
  const showError = (message: string) => showToast(message, "error");
  const showInfo = (message: string) => showToast(message, "info");

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};
