import { Link } from "react-router";
import Badge from "@/shared/ui/Badge/Badge";
import type { SetType } from "../../model/types";
import styles from "./SetCard.module.css";

interface SetCardProps {
  set: SetType;
}

const SetCard = ({ set }: SetCardProps) => {
  return (
    <Link to={`/collections/${set.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{set.title}</h3>
          <Badge variant={set.visibility} />
        </div>

        {set.description && (
          <p className={styles.description}>{set.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.count}>
            {set.objectCount} {set.objectCount === 1 ? "объект" : "объектов"}
          </span>
          <span className={styles.date}>
            {new Date(set.updatedAt).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SetCard;
