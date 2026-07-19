import { forwardRef } from "react";
import crossIcon from "@/assets/icons/cross-icon.svg";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    const handleClear = () => {
      if (props.onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;

        props.onChange(event);
      }
    };

    return (
      <div className={`${styles.inputWrapper} ${className || ""}`}>
        <div className={styles.inputContainer}>
          <input ref={ref} {...props} className={styles.input} />
          {props.value && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClear}
            >
              <img src={crossIcon} alt="" />
            </button>
          )}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);

export default Input;

// ОСТАНОВИЛСЯ НА ЭТОМ ФАЙЛЕ
