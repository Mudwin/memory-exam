import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { useCards } from "@/features/cards/model/useCards";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import styles from "./CardsPage.module.css";

const CardsPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, objects, isLoading } = useSet(setId);
  const [isStarted, setIsStarted] = useState(false);

  const {
    currentObject,
    currentIndex,
    total,
    results,
    isFlipped,
    isComplete,
    answeredCount,
    rememberCount,
    forgotCount,
    flipCard,
    answer,
    reset,
    goToNext,
    goToPrevious,
  } = useCards({
    objects: objects || [],
    setId: setId || "",
  });

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  if (!set) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>Набор не найден</p>
        <Button buttonType="save" onClick={() => navigate("/collections")}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  if (objects.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="В наборе нет объектов"
          description="Добавьте объекты, чтобы изучать их в режиме карточек"
          actionButton={
            <Button
              buttonType="save"
              onClick={() => navigate(`/collections/${setId}/objects/new`)}
            >
              Добавить объект
            </Button>
          }
        />
      </div>
    );
  }

  if (!isStarted || isComplete) {
    const isResultScreen = isStarted && isComplete;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{set.title}</h1>
          <p className={styles.subtitle}>Режим карточек</p>
        </div>

        {isResultScreen ? (
          <div className={styles.resultScreen}>
            <div className={styles.resultCard}>
              <h2 className={styles.resultTitle}>Результаты</h2>
              <div className={styles.resultStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{answeredCount}</span>
                  <span className={styles.statLabel}>всего отвечено</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{rememberCount}</span>
                  <span className={styles.statLabel}>помню</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{forgotCount}</span>
                  <span className={styles.statLabel}>забыл</span>
                </div>
              </div>
              <div className={styles.resultActions}>
                <Button buttonType="save" onClick={reset}>
                  Начать заново
                </Button>
                <button
                  className={styles.backButton}
                  onClick={() => navigate(`/collections/${setId}`)}
                >
                  Вернуться к набору
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.startScreen}>
            <div className={styles.startInfo}>
              <p className={styles.startCount}>
                В наборе <strong>{objects.length}</strong>{" "}
                {objects.length === 1 ? "карточка" : "карточек"}
              </p>
              <p className={styles.startHint}>
                Вам будут показаны изображения. Постарайтесь вспомнить
                информацию, затем нажмите "Показать ответ" и оцените, помните ли
                вы.
              </p>
            </div>
            <Button buttonType="save" onClick={() => setIsStarted(true)}>
              Начать изучение
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (!currentObject) {
    return (
      <div className={styles.centerMessage}>
        <p>Не удалось загрузить карточку</p>
      </div>
    );
  }

  const fields = currentObject.fields || [];
  const primaryField = fields[0] || null;
  const secondaryField = fields.length > 1 ? fields[1] : null;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <span className={styles.progressText}>
          {currentIndex + 1} из {total}
        </span>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(answeredCount / total) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            {currentObject.imageUrl ? (
              <img
                src={currentObject.imageUrl}
                alt={primaryField?.value || "Карточка"}
              />
            ) : (
              <div className={styles.placeholderImage}>
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className={styles.cardContent}>
            {!isFlipped ? (
              <div className={styles.question}>
                {primaryField && (
                  <div className={styles.questionField}>
                    <span className={styles.fieldLabel}>
                      {primaryField.fieldName}
                    </span>
                    <span className={styles.fieldValue}>?</span>
                  </div>
                )}
                {secondaryField && (
                  <div className={styles.questionField}>
                    <span className={styles.fieldLabel}>
                      {secondaryField.fieldName}
                    </span>
                    <span className={styles.fieldValue}>?</span>
                  </div>
                )}
                <button className={styles.flipButton} onClick={flipCard}>
                  Показать ответ
                </button>
              </div>
            ) : (
              <div className={styles.answer}>
                {fields.map((field) => (
                  <div key={field.fieldId} className={styles.answerField}>
                    <span className={styles.fieldLabel}>{field.fieldName}</span>
                    <span className={styles.fieldValue}>
                      {field.value || "—"}
                    </span>
                  </div>
                ))}
                <div className={styles.answerActions}>
                  <Button buttonType="delete" onClick={() => answer("forgot")}>
                    Забыл
                  </Button>
                  <Button buttonType="save" onClick={() => answer("remember")}>
                    Помню
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          ← Назад
        </button>
        <button
          className={styles.navButton}
          onClick={goToNext}
          disabled={currentIndex === total - 1}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
};

export default CardsPage;
