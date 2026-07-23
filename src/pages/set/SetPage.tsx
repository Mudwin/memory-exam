import { useParams, useNavigate } from "react-router";
import { useSet } from "@/entities/set/model/useSet";
import { useObjects } from "@/entities/object/model/useObjects";
import ObjectCard from "@/entities/object/ui/ObjectCard";
import EmptyState from "@/shared/ui/EmptyState";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import FieldDefinitionsManager from "@/features/field-definitions/ui/FieldDefinitionsManager";
import { setApi } from "@/entities/set/api/setApi";
import { useToastContext } from "@/app/providers/ToastProvider";
import styles from "./SetPage.module.css";

const SetPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, objects, isLoading, error, refresh } = useSet(setId);
  const { deleteObject } = useObjects(setId || "", objects);
  const { showSuccess, showError } = useToastContext();

  const handleSaveFields = async (fields: any[]) => {
    if (!setId) return;
    await setApi.updateSet(setId, { fields });
    refresh();
  };

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p>Загрузка набора...</p>
      </div>
    );
  }

  if (error || !set) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>{error || "Набор не найден"}</p>
        <Button buttonType="save" onClick={() => navigate("/collections")}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const handleDeleteObject = async (objectId: string) => {
    if (confirm("Удалить этот объект?")) {
      try {
        await deleteObject(objectId);
        showSuccess("Объект удалён");
        refresh();
      } catch (err) {
        showError("Не удалось удалить объект");
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{set.title}</h1>
            <Badge variant={set.visibility} />
          </div>
          <div className={styles.actions}>
            <Button
              buttonType="save"
              onClick={() => navigate(`/collections/${setId}/edit`)}
            >
              Редактировать
            </Button>
          </div>
        </div>
        {set.description && (
          <p className={styles.description}>{set.description}</p>
        )}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            {set.objectCount} {set.objectCount === 1 ? "объект" : "объектов"}
          </span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.metaItem}>
            Создан: {new Date(set.createdAt).toLocaleDateString("ru-RU")}
          </span>
          <span className={styles.metaDivider}>•</span>
          <span className={styles.metaItem}>
            Обновлён: {new Date(set.updatedAt).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>

      <FieldDefinitionsManager
        fields={set.fields || []}
        onSave={handleSaveFields}
      />

      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Button
            buttonType="save"
            onClick={() => navigate(`/collections/${setId}/objects/new`)}
          >
            + Добавить объект
          </Button>
          <Button buttonType="save" disabled>
            Импорт
          </Button>
        </div>
        <div className={styles.toolbarRight}>
          <Button
            buttonType="save"
            onClick={() => navigate(`/collections/${setId}/cards`)}
          >
            Карточки
          </Button>
          <Button
            buttonType="save"
            onClick={() => navigate(`/collections/${setId}/test`)}
          >
            Тест
          </Button>
          <Button
            buttonType="save"
            onClick={() => navigate(`/collections/${setId}/exam`)}
          >
            Экзамен
          </Button>
          <Button buttonType="save" disabled>
            Статистика
          </Button>
        </div>
      </div>

      {objects.length === 0 ? (
        <EmptyState
          title="В наборе пока нет объектов"
          description="Добавьте первый объект, чтобы начать наполнять набор"
          actionButton={
            <Button
              buttonType="save"
              onClick={() => navigate(`/collections/${setId}/objects/new`)}
            >
              + Добавить объект
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {objects.map((object) => (
            <div key={object.id} className={styles.cardWrapper}>
              <ObjectCard
                object={object}
                onClick={() =>
                  navigate(`/collections/${setId}/objects/${object.id}/edit`)
                }
              />
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteObject(object.id)}
                aria-label="Удалить объект"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetPage;
