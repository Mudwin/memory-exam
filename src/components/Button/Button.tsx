import styles from "./Button.module.css";

type ButtonType = "save" | "delete";

interface ButtonProps {
  children: React.ReactNode;
  buttonType: ButtonType;
}

const Button = ({ children, buttonType }: ButtonProps) => {
  return (
    <button
      className={styles.button}
      style={
        (buttonType === "save"
          ? {
              "--primary-color": "var(--primary-color-green)",
              "--accent-color": "var(--accent-color-green)",
            }
          : {
              "--primary-color": "var(--primary-color-red)",
              "--accent-color": "var(--accent-color-red)",
            }) as React.CSSProperties
      }
    >
      {children}
    </button>
  );
};

export default Button;
