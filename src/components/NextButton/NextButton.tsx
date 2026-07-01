import arrowIcon from "@/assets/icons/arrow.svg";
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
