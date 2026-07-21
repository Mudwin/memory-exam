import styles from "./Badge.module.css";

interface BadgeProps {
  variant: "public" | "private";
}

const Badge = ({ variant }: BadgeProps) => {
  const label = variant === "public" ? "Публичный" : "Приватный";

  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>;
};

export default Badge;
