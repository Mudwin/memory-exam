import styles from "./TestButton.module.css";

type AnswerStatus = "default" | "correct" | "error";

interface TestButtonProps {
  answer: string;
  answerStatus?: AnswerStatus;
}

const TestButton = ({ answer, answerStatus = "default" }: TestButtonProps) => {
  return (
    <div
      className={`${styles.container} ${answerStatus == "correct" ? styles.correct : answerStatus === "error" ? styles.error : ""}`}
      role="button"
    >
      <span className={styles.answer}>{answer}</span>
    </div>
  );
};

export default TestButton;
