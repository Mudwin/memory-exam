import { useState, type ChangeEvent } from "react";
import crossIcon from "@/assets/icons/cross-icon.svg";
import styles from "./Input.module.css";

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Input = ({
  id,
  type,
  placeholder,
  value: externalValue,
  onChange: externalOnChange,
}: InputProps) => {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = externalValue !== undefined;

  const value = isControlled ? externalValue : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (isControlled) {
      externalOnChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleClear = () => {
    if (isControlled) {
      externalOnChange?.("");
    } else {
      setInternalValue("");
    }
  };

  return (
    <div className={styles.inputContainer}>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={styles.input}
      />
      {value && (
        <button
          className={styles.clearButton}
          onClick={handleClear}
          type="button"
        >
          <img src={crossIcon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Input;

// ОСТАНОВИЛСЯ НА ЭТОМ ФАЙЛЕ
