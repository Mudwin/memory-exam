import styles from "./FormContainer.module.css";

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer = ({ children }: FormContainerProps) => {
  return <div className={styles.container}>{children}</div>;
};

export default FormContainer;
