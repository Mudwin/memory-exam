import styles from "./FormError.module.css";

interface FormErrorProps {
  message?: string | null;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return <span className={styles.error}>{message}</span>;
};

export default FormError;
