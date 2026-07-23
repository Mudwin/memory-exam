import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { useTest } from "@/features/test/model/useTest";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import styles from "./TestPage.module.css";

const TestPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, objects, isLoading } = useSet(setId);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const {
    state,
    currentQuestion,
    totalQuestions,
    answeredCount,
    isComplete,
    startTest,
    selectAnswer,
    goToQuestion,
    reset,
    getResults,
    canStart,
    fields,
  } = useTest({
    objects: objects || [],
    fields: set?.fields || [],
    setId: setId || "",
  });

  useEffect(() => {
    if (isComplete && state.questions.length > 0 && !showResults) {
      setShowResults(true);
    }
  }, [isComplete, state.questions.length, showResults]);

  const handleStart = () => {
    if (!selectedFieldId) return;
    const success = startTest(selectedFieldId);
    if (!success) {
      alert("Недостаточно объектов для теста по этому полю (нужно минимум 2)");
    }
    setShowResults(false);
  };

  const handleReset = () => {
    reset();
    setShowResults(false);
    setSelectedFieldId("");
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
          description="Для теста нужно минимум 2 объекта с заполненными полями"
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

  if (state.questions.length === 0) {
    const availableFields = fields.filter((f) => canStart(f.id));

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Тест</h1>
          <p className={styles.subtitle}>Выберите поле для тестирования</p>
        </div>

        <div className={styles.startScreen}>
          {availableFields.length === 0 ? (
            <EmptyState
              title="Нет доступных полей"
              description="Для теста нужно иметь хотя бы 2 объекта с заполненными полями"
            />
          ) : (
            <>
              <div className={styles.fieldSelect}>
                {availableFields.map((f) => (
                  <label key={f.id} className={styles.fieldOption}>
                    <input
                      type="radio"
                      name="testField"
                      value={f.id}
                      checked={selectedFieldId === f.id}
                      onChange={() => setSelectedFieldId(f.id)}
                    />
                    {f.name}
                  </label>
                ))}
              </div>
              <Button
                buttonType="save"
                disabled={!selectedFieldId}
                onClick={handleStart}
              >
                Начать тест
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (showResults || isComplete) {
    const results = getResults();
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Результаты теста</h1>
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
          Вопрос {state.currentIndex + 1} из {totalQuestions}
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
          onClick={() => {
            const newIndex = Math.max(0, state.currentIndex - 1);

            goToQuestion(newIndex);
          }}
          disabled={state.currentIndex === 0}
        >
          ← Назад
        </button>
        <button
          className={styles.navButton}
          onClick={() => {
            const newIndex = Math.min(
              totalQuestions - 1,
              state.currentIndex + 1,
            );

            goToQuestion(newIndex);
          }}
          disabled={state.currentIndex === totalQuestions - 1}
        >
          Вперёд →
        </button>
      </div>
    </div>
  );
};

export default TestPage;
