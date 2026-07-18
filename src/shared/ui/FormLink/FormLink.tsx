import { Link } from "react-router";
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
      <Link to={to} className={styles.link}>
        {linkText}
      </Link>
    </p>
  );
};

export default FormLink;
