import styles from "./Button.module.css";

type ButtonType = "save" | "delete";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonType: ButtonType;
}

const Button = ({
  children,
  buttonType,
  type = "button",
  disabled,
  ...props
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
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
