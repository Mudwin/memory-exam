import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { setApi } from "@/entities/set/api/setApi";
import { objectApi } from "@/entities/object/api/objectApi";
import { getImage } from "@/shared/lib/indexedDB";
import ObjectCard from "@/entities/object/ui/ObjectCard";
import EmptyState from "@/shared/ui/EmptyState";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import { useAuth } from "@/entities/user/model/useAuth";
import type { SetType, SetPublicSettings } from "@/entities/set/model/types";
import type { ObjectType } from "@/entities/object/model/types";
import flashcardsIcon from "@/assets/icons/flashcards-icon.svg";
import testIcon from "@/assets/icons/test-icon.svg";
import examIcon from "@/assets/icons/exam-icon.svg";
import lockIcon from "@/assets/icons/lock-icon.svg";
import styles from "./PublicSetPage.module.css";

const PublicSetPage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [set, setSet] = useState<SetType | null>(null);
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [settings, setSettings] = useState<SetPublicSettings | null>(null);
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

        const settingsData = await setApi.getPublicSettings(setData.id);
        setSettings(settingsData);

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

  if (settings?.requireAuth && !isAuthenticated && !isLoading) {
    return (
      <div className={styles.centerMessage}>
        <h2 className={styles.accessDeniedTitle}>Требуется авторизация</h2>
        <p className={styles.accessDeniedText}>
          Для доступа к этому набору необходимо войти в аккаунт
        </p>
        <Button buttonType="save" onClick={() => navigate("/login")}>
          Войти
        </Button>
      </div>
    );
  }

  const hasAnyMode =
    settings &&
    (settings.allowCards || settings.allowTests || settings.allowExam);

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

      <div className={styles.modesSection}>
        <h2 className={styles.modesTitle}>Режимы обучения</h2>

        {settings && (
          <div className={styles.modesGrid}>
            <button
              className={`${styles.modeButton} ${!settings.allowCards ? styles.modeButtonDisabled : ""}`}
              disabled={!settings.allowCards}
              onClick={() => navigate(`/s/${shareId}/cards`)}
            >
              <span className={styles.modeIcon}>
                <img src={flashcardsIcon} alt="" />
              </span>
              Карточки
              {!settings.allowCards && (
                <span className={styles.modeLock}>
                  <img src={lockIcon} alt="" />
                </span>
              )}
            </button>
            <button
              className={`${styles.modeButton} ${!settings.allowTests ? styles.modeButtonDisabled : ""}`}
              disabled={!settings.allowTests}
              onClick={() => navigate(`/s/${shareId}/test`)}
            >
              <span className={styles.modeIcon}>
                <img src={testIcon} alt="" />
              </span>
              Тест
              {!settings.allowTests && (
                <span className={styles.modeLock}>
                  <img src={lockIcon} alt="" />
                </span>
              )}
            </button>
            <button
              className={`${styles.modeButton} ${!settings.allowExam ? styles.modeButtonDisabled : ""}`}
              disabled={!settings.allowExam}
              onClick={() => navigate(`/s/${shareId}/exam`)}
            >
              <span className={styles.modeIcon}>
                <img src={examIcon} alt="" />
              </span>
              Экзамен
              {!settings.allowExam && (
                <span className={styles.modeLock}>
                  <img src={lockIcon} alt="" />
                </span>
              )}
            </button>
          </div>
        )}

        {!hasAnyMode && (
          <p className={styles.noModesMessage}>
            Автор не разрешил ни один режим обучения для этого набора.
          </p>
        )}
      </div>

      <div className={styles.objectsSection}>
        <h2 className={styles.objectsTitle}>Объекты ({objects.length})</h2>
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
    </div>
  );
};

export default PublicSetPage;
