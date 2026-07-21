import type { ObjectType } from "../../model/types";
import styles from "./ObjectCard.module.css";

interface ObjectCardProps {
  object: ObjectType;
  onClick?: () => void;
}

const ObjectCard = ({ object, onClick }: ObjectCardProps) => {
  const hasImage = !!object.imageUrl;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageContainer}>
        {hasImage ? (
          <img
            src={object.imageUrl}
            alt={object.fields[0]?.value || "Объект"}
          />
        ) : (
          <div className={styles.placeholder}>Нет изображения</div>
        )}
      </div>
      <div className={styles.fields}>
        {object.fields.map((field, index) => {
          if (index === 0) {
            return (
              <div key={field.fieldId} className={styles.primaryField}>
                {field.value}
              </div>
            );
          }
          return (
            <div key={field.fieldId} className={styles.field}>
              <span className={styles.fieldName}>{field.fieldName}:</span>
              <span className={styles.fieldValue}>{field.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectCard;
