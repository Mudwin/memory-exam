import arrowIcon from "@/assets/icons/arrow-icon.svg";
import styles from "./NextButton.module.css";

const NextButton = () => {
  return (
    <button className={styles.button}>
      <span>Next</span>
      <img src={arrowIcon} alt="" />
    </button>
  );
};

export default NextButton;
