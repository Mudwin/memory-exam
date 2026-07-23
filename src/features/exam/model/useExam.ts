import { useState, useCallback } from "react";
import type { ExamConfig, ExamQuestion, UseExamOptions } from "./types";

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

  return shuffleArray([correct, ...selected]);
};

export const useExam = ({ objects, fields }: UseExamOptions) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [config, setConfig] = useState<ExamConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExam = useCallback(
    (config: ExamConfig) => {
      setIsGenerating(true);

      const { questionCount, selectedFieldIds } = config;

      const allQuestions: ExamQuestion[] = [];

      selectedFieldIds.forEach((fieldId) => {
        const field = fields.find((f) => f.id === fieldId);
        if (!field) return;

        const objectsWithField = objects.filter((obj) => {
          const val = obj.fields.find((f) => f.fieldId === fieldId);
          return val && val.value.trim() !== "";
        });

        if (objectsWithField.length < 2) return;

        const allValues = objectsWithField
          .map(
            (obj) => obj.fields.find((f) => f.fieldId === fieldId)?.value || "",
          )
          .filter((v) => v.trim() !== "");

        objectsWithField.forEach((obj) => {
          const correctValue =
            obj.fields.find((f) => f.fieldId === fieldId)?.value || "";

          const options = getRandomOptions(allValues, correctValue, 3);

          allQuestions.push({
            id: obj.id,
            fieldId,
            fieldName: field.name,
            correctAnswer: correctValue,
            options,
            userAnswerIndex: null,
            isCorrect: null,
          });
        });
      });

      let shuffled = shuffleArray(allQuestions);

      const count = Math.min(questionCount, shuffled.length);
      const selectedQuestions = shuffled.slice(0, count);

      setQuestions(selectedQuestions);
      setCurrentIndex(0);
      setIsFinished(false);
      setConfig(config);
      setIsGenerating(false);

      return selectedQuestions.length;
    },
    [objects, fields],
  );

  const currentQuestion = questions[currentIndex] || null;
  const totalQuestions = questions.length;
  const answeredCount = questions.filter(
    (q) => q.userAnswerIndex !== null,
  ).length;

  const isComplete = isFinished || answeredCount === totalQuestions;

  const selectAnswer = useCallback(
    (optionIndex: number) => {
      if (isComplete || !currentQuestion) return;

      setQuestions((prev) => {
        const newQuestions = [...prev];
        const q = newQuestions[currentIndex];
        q.userAnswerIndex = optionIndex;
        q.isCorrect = q.options[optionIndex] === q.correctAnswer;

        const nextIndex = currentIndex + 1;
        const isFinishedNow = nextIndex >= newQuestions.length;

        if (isFinishedNow) {
          setIsFinished(true);
        } else {
          setCurrentIndex(nextIndex);
        }

        return newQuestions;
      });
    },
    [isComplete, currentQuestion, currentIndex],
  );

  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questions.length) {
        setCurrentIndex(index);
      }
    },
    [questions.length],
  );

  const reset = useCallback(() => {
    setQuestions([]);
    setCurrentIndex(0);
    setIsFinished(false);
    setConfig(null);
  }, []);

  const getResults = useCallback(() => {
    const total = questions.length;
    const correct = questions.filter((q) => q.isCorrect === true).length;
    const wrong = questions.filter((q) => q.isCorrect === false);
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return {
      total,
      correct,
      wrongCount: wrong.length,
      percentage,
      wrongAnswers: wrong,
    };
  }, [questions]);

  const canGenerate = useCallback(
    (selectedFieldIds: string[], questionCount: number): boolean => {
      if (selectedFieldIds.length === 0) return false;
      if (questionCount < 1) return false;

      let totalAvailable = 0;

      for (const fieldId of selectedFieldIds) {
        const field = fields.find((f) => f.id === fieldId);

        if (!field) continue;

        const objectsWithField = objects.filter((obj) => {
          const val = obj.fields.find((f) => f.fieldId === fieldId);
          return val && val.value.trim() !== "";
        });

        if (objectsWithField.length >= 2) {
          totalAvailable += objectsWithField.length;
        }
      }

      return totalAvailable >= 1;
    },
    [fields, objects],
  );

  return {
    questions,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    isComplete,
    isFinished,
    config,
    isGenerating,
    generateExam,
    selectAnswer,
    goToQuestion,
    reset,
    getResults,
    canGenerate,
  };
};
