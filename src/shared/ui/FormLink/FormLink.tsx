import styles from "./FormLink.module.css";

interface FormLinkProps {
  text: string;
  linkText: string;
  to: string;
}

const FormLink = ({ text, linkText, to }: FormLinkProps) => {
  return (
    <p className={styles.subtext}>
      {text}{" "}
      <a href={to} className={styles.link}>
        {linkText}
      </a>
    </p>
  );
};

export default FormLink;
