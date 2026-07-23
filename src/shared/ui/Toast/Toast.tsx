import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div
      className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.hiding : ""}`}
    >
      <span className={styles.message}>{message}</span>
      <button
        className={styles.closeButton}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      >
        ×
      </button>
    </div>,
    document.body,
  );
};

export default Toast;
