import styles from "./Checkbox.module.css";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Checkbox = ({ label, id, ...props }: CheckboxProps) => {
  return (
    <div className={styles.checkboxWrapper}>
      <input type="checkbox" id={id} className={styles.checkbox} {...props} />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
