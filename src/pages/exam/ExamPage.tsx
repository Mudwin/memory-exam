import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { useExam } from "@/features/exam/model/useExam";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import { useToastContext } from "@/app/providers/ToastProvider";
import styles from "./ExamPage.module.css";

const ExamPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, objects, isLoading } = useSet(setId);
  const { showError, showSuccess } = useToastContext();

  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [showResults, setShowResults] = useState(false);

  const {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    isComplete,
    isGenerating,
    generateExam,
    selectAnswer,
    goToQuestion,
    reset,
    getResults,
    canGenerate,
  } = useExam({
    objects: objects || [],
    fields: set?.fields || [],
  });

  useEffect(() => {
    if (isComplete && questions.length > 0 && !showResults) {
      setShowResults(true);
    }
  }, [isComplete, questions.length, showResults]);

  const handleStart = () => {
    if (selectedFieldIds.length === 0) {
      showError("Выберите хотя бы одно поле");
      return;
    }
    if (questionCount < 1) {
      showError("Количество вопросов должно быть больше 0");
      return;
    }

    const count = generateExam({
      selectedFieldIds,
      questionCount,
    });

    if (count === 0) {
      showError("Недостаточно данных для генерации экзамена");
    } else {
      showSuccess(`Сгенерировано ${count} вопросов`);
    }

    setShowResults(false);
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
    setSelectedFieldIds([]);
    setQuestionCount(10);
  };

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFieldIds((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId],
    );
  };

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

  if (objects.length < 2) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Недостаточно объектов"
          description="Для экзамена нужно минимум 2 объекта с заполненными полями"
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

  if (questions.length === 0) {
    const availableFields = set.fields || [];

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Экзамен</h1>
          <p className={styles.subtitle}>Настройте параметры экзамена</p>
        </div>

        <div className={styles.startScreen}>
          <div className={styles.configSection}>
            <div className={styles.fieldSelection}>
              <h3 className={styles.configLabel}>Выберите поля для экзамена</h3>

              <div className={styles.fieldCheckboxes}>
                {availableFields.map((f) => {
                  const isAvailable = canGenerate([f.id], 1);
                  return (
                    <label
                      key={f.id}
                      className={`${styles.fieldCheckbox} ${
                        !isAvailable ? styles.fieldDisabled : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFieldIds.includes(f.id)}
                        onChange={() => handleFieldToggle(f.id)}
                        disabled={!isAvailable}
                      />
                      {f.name}
                      {!isAvailable && (
                        <span className={styles.fieldHint}>
                          (недостаточно данных)
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {availableFields.length === 0 && (
                <p className={styles.noFieldsMessage}>
                  Сначала добавьте поля в наборе
                </p>
              )}
            </div>

            <div className={styles.countSection}>
              <label htmlFor="count" className={styles.configLabel}>
                Количество вопросов
              </label>
              <input
                id="count"
                type="number"
                className={styles.countInput}
                min="1"
                max="100"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
              />
            </div>
          </div>

          <Button
            buttonType="save"
            disabled={
              selectedFieldIds.length === 0 || questionCount < 1 || isGenerating
            }
            onClick={handleStart}
          >
            Начать экзамен
          </Button>
        </div>
      </div>
    );
  }

  if (showResults || isComplete) {
    const results = getResults();
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Результаты экзамена</h1>
        </div>

        <div className={styles.resultCard}>
          <div className={styles.resultStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{results.percentage}%</span>
              <span className={styles.statLabel}>Правильных</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>
                {results.correct}/{results.total}
              </span>
              <span className={styles.statLabel}>Верно</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{results.wrongCount}</span>
              <span className={styles.statLabel}>Ошибок</span>
            </div>
          </div>

          {results.wrongAnswers.length > 0 && (
            <div className={styles.wrongList}>
              <h3 className={styles.wrongTitle}>Список ошибок</h3>

              {results.wrongAnswers.map((q, idx) => (
                <div key={idx} className={styles.wrongItem}>
                  <p className={styles.wrongQuestion}>Вопрос: {q.fieldName}</p>
                  <p className={styles.wrongCorrect}>
                    Правильный ответ: {q.correctAnswer}
                  </p>
                  <p className={styles.wrongUser}>
                    Ваш ответ:{" "}
                    {q.userAnswerIndex !== null
                      ? q.options[q.userAnswerIndex]
                      : "не выбран"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.resultActions}>
            <Button buttonType="save" onClick={handleReset}>
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
    );
  }

  if (!currentQuestion) {
    return (
      <div className={styles.centerMessage}>
        <p>Не удалось загрузить вопрос</p>
      </div>
    );
  }

  const progress = `${answeredCount} / ${totalQuestions}`;

  return (
    <div className={styles.container}>
      <div className={styles.progressBar}>
        <span className={styles.progressText}>
          Вопрос {currentIndex + 1} из {totalQuestions}
        </span>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionImage}>
          {objects.find((o) => o.id === currentQuestion.id)?.imageUrl ? (
            <img
              src={objects.find((o) => o.id === currentQuestion.id)?.imageUrl}
              alt="Объект"
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>Нет изображения</span>
            </div>
          )}
        </div>

        <div className={styles.questionContent}>
          <h3 className={styles.questionTitle}>
            Какое значение у поля "{currentQuestion.fieldName}" для этого
            объекта?
          </h3>

          <div className={styles.options}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = currentQuestion.userAnswerIndex === idx;
              const isCorrect = currentQuestion.isCorrect;
              const showCorrectness = isSelected && isCorrect !== null;

              let optionClass = styles.option;
              if (showCorrectness) {
                if (isCorrect) {
                  optionClass += ` ${styles.optionCorrect}`;
                } else {
                  optionClass += ` ${styles.optionWrong}`;
                }
              }

              return (
                <button
                  key={idx}
                  className={optionClass}
                  onClick={() => selectAnswer(idx)}
                  disabled={isComplete}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={() => goToQuestion(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Назад
        </button>
        <button
          className={styles.navButton}
          onClick={() =>
            goToQuestion(Math.min(totalQuestions - 1, currentIndex + 1))
          }
          disabled={currentIndex === totalQuestions - 1}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
};

export default ExamPage;
