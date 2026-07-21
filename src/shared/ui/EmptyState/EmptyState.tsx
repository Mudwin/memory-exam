import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

const EmptyState = ({ title, description, actionButton }: EmptyStateProps) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}

        {actionButton && <div className={styles.action}>{actionButton}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
