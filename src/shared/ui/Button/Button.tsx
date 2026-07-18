import styles from "./Button.module.css";

type ButtonType = "save" | "delete";

interface ButtonProps {
  children: React.ReactNode;
  buttonType: ButtonType;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button = ({
  children,
  buttonType,
  type = "button",
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
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
