import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setApi } from "@/entities/set/api/setApi";
import { objectApi } from "@/entities/object/api/objectApi";
import { getImage } from "@/shared/lib/indexedDB";
import ObjectCard from "@/entities/object/ui/ObjectCard";
import EmptyState from "@/shared/ui/EmptyState";
import Badge from "@/shared/ui/Badge";
import type { SetType } from "@/entities/set/model/types";
import type { ObjectType } from "@/entities/object/model/types";
import styles from "./PublicSetPage.module.css";

const PublicSetPage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [set, setSet] = useState<SetType | null>(null);
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) {
      setError("Ссылка некорректна");
      setIsLoading(false);
      return;
    }

    const loadPublicSet = async () => {
      try {
        const setData = await setApi.getPublicSetByShareId(shareId);
        setSet(setData);

        const objectsData = await objectApi.getObjects(setData.id);

        const objectsWithImages = await Promise.all(
          objectsData.map(async (obj) => {
            try {
              const blob = await getImage(obj.id);

              if (blob) {
                const url = URL.createObjectURL(blob);
                return { ...obj, imageUrl: url };
              }
            } catch (err) {}
            return obj;
          }),
        );

        setObjects(objectsWithImages);
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 403) {
          setError("Набор не найден или недоступен");
        } else {
          setError("Ошибка загрузки набора");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicSet();

    return () => {
      objects.forEach((obj) => {
        if (obj.imageUrl) {
          URL.revokeObjectURL(obj.imageUrl);
        }
      });
    };
  }, [shareId]);

  useEffect(() => {
    if (set) {
      document.title = `${set.title} — MemoryExam`;
    } else if (error) {
      document.title = "Набор не найден — MemoryExam";
    }
  }, [set, error]);

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.loadingText}>Загрузка набора...</p>
      </div>
    );
  }

  if (error || !set) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>{error || "Набор не найден"}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{set.title}</h1>
            <Badge variant="public" />
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
        </div>
      </div>

      {objects.length === 0 ? (
        <EmptyState
          title="В этом наборе пока нет объектов"
          description="Возможно, автор ещё не добавил материалы"
        />
      ) : (
        <div className={styles.grid}>
          {objects.map((object) => (
            <ObjectCard key={object.id} object={object} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicSetPage;
