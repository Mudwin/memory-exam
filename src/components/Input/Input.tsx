import { useState, type ChangeEvent } from "react";
import crossIcon from "@/assets/icons/cross-icon.svg";
import styles from "./Input.module.css";

interface InputProps {
  id: string;
  type: string;
  placeholder: string;
}

const Input = ({ id, type, placeholder }: InputProps) => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
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
        <button className={styles.clearButton} onClick={handleClear}>
          <img src={crossIcon} alt="" />
        </button>
      )}
    </div>
  );
};

export default Input;
