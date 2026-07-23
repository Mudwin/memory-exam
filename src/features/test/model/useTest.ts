import { useState, useEffect, useCallback, useRef } from "react";
import type { TestQuestion, TestState, UseTestOptions } from "./types";

const STORAGE_KEY_PREFIX = "test_progress_";

const getStorageKey = (setId: string) => `${STORAGE_KEY_PREFIX}${setId}`;

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getRandomOptions = (
  allValues: string[],
  correct: string,
  count: number = 3,
): string[] => {
  const available = allValues.filter((v) => v !== correct && v.trim() !== "");
  const shuffled = shuffleArray(available);
  const selected = shuffled.slice(0, count);

  while (selected.length < count) {
    selected.push("—");
  }
  const result = shuffleArray([correct, ...selected]);
  return result;
};

export const useTest = ({ objects, fields, setId }: UseTestOptions) => {
  const [state, setState] = useState<TestState>(() => {
    const saved = localStorage.getItem(getStorageKey(setId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.questions && parsed.questions.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      questions: [],
      currentIndex: 0,
      selectedFieldId: null,
      isFinished: false,
      startedAt: new Date().toISOString(),
    };
  });

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(
    state.selectedFieldId,
  );
  const [isLoading, setIsLoading] = useState(false);

  const generatedRef = useRef(false);

  const generateQuestions = useCallback(
    (fieldId: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return [];

      const objectsWithField = objects.filter((obj) => {
        const val = obj.fields.find((f) => f.fieldId === fieldId);
        return val && val.value.trim() !== "";
      });

      if (objectsWithField.length === 0) {
        return [];
      }

      const allValues = objectsWithField
        .map(
          (obj) => obj.fields.find((f) => f.fieldId === fieldId)?.value || "",
        )
        .filter((v) => v.trim() !== "");

      const questions: TestQuestion[] = objectsWithField.map((obj) => {
        const correctValue =
          obj.fields.find((f) => f.fieldId === fieldId)?.value || "";
        const options = getRandomOptions(allValues, correctValue, 3);
        return {
          id: obj.id,
          fieldId: fieldId,
          fieldName: field.name,
          correctAnswer: correctValue,
          options,
          userAnswerIndex: null,
          isCorrect: null,
        };
      });

      return shuffleArray(questions);
    },
    [objects, fields],
  );

  const startTest = useCallback(
    (fieldId: string) => {
      const questions = generateQuestions(fieldId);
      if (questions.length === 0) {
        return false;
      }

      const newState: TestState = {
        questions,
        currentIndex: 0,
        selectedFieldId: fieldId,
        isFinished: false,
        startedAt: new Date().toISOString(),
      };
      setState(newState);
      setSelectedFieldId(fieldId);
      localStorage.setItem(getStorageKey(setId), JSON.stringify(newState));
      return true;
    },
    [generateQuestions, setId],
  );

  useEffect(() => {
    if (state.questions.length === 0 && !generatedRef.current) {
      generatedRef.current = true;

      const saved = localStorage.getItem(getStorageKey(setId));
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.questions && parsed.questions.length > 0) {
            const objectIds = new Set(objects.map((o) => o.id));
            const allExist = parsed.questions.every((q: TestQuestion) =>
              objectIds.has(q.id),
            );

            if (allExist) {
              setState(parsed);
              setSelectedFieldId(parsed.selectedFieldId);
              return;
            }
          }
        } catch (err) {}
      }
    }
  }, [state.questions.length, objects, setId]);

  useEffect(() => {
    if (state.questions.length > 0) {
      localStorage.setItem(getStorageKey(setId), JSON.stringify(state));
    }
  }, [state, setId]);

  const currentQuestion = state.questions[state.currentIndex] || null;
  const totalQuestions = state.questions.length;
  const answeredCount = state.questions.filter(
    (q) => q.userAnswerIndex !== null,
  ).length;
  const isComplete = state.isFinished || answeredCount === totalQuestions;

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (isComplete || !currentQuestion) return;

      setState((prev) => {
        const newQuestions = [...prev.questions];
        const q = newQuestions[prev.currentIndex];
        q.userAnswerIndex = optionIndex;
        q.isCorrect = q.options[optionIndex] === q.correctAnswer;

        const nextIndex = prev.currentIndex + 1;
        const isFinished = nextIndex >= prev.questions.length;

        return {
          ...prev,
          questions: newQuestions,
          currentIndex: isFinished ? prev.currentIndex : nextIndex,
          isFinished,
        };
      });
    },
    [isComplete, currentQuestion],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < state.questions.length) {
        setState((prev) => ({ ...prev, currentIndex: index }));
      }
    },
    [state.questions.length],
  );

  const reset = useCallback(() => {
    localStorage.removeItem(getStorageKey(setId));

    setState({
      questions: [],
      currentIndex: 0,
      selectedFieldId: null,
      isFinished: false,
      startedAt: new Date().toISOString(),
    });

    setSelectedFieldId(null);
  }, [setId]);

  const getResults = useCallback(() => {
    const total = state.questions.length;
    const correct = state.questions.filter((q) => q.isCorrect === true).length;
    const wrong = state.questions.filter((q) => q.isCorrect === false);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      total,
      correct,
      wrongCount: wrong.length,
      percentage,
      wrongAnswers: wrong,
    };
  }, [state.questions]);

  const canStart = (fieldId: string): boolean => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return false;

    const objectsWithField = objects.filter((obj) => {
      const val = obj.fields.find((f) => f.fieldId === fieldId);
      return val && val.value.trim() !== "";
    });

    return objectsWithField.length >= 2;
  };

  return {
    state,
    currentQuestion,
    totalQuestions,
    answeredCount,
    isComplete,
    selectedFieldId,
    fields,
    startTest,
    selectAnswer,
    goToQuestion,
    reset,
    getResults,
    canStart,
    isLoading,
  };
};
