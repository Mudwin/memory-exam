import { useState, useEffect, useCallback, useRef } from "react";
import type { ObjectType } from "@/entities/object/model/types";

export type CardResult = "remember" | "forgot" | null;

interface CardsState {
  objects: ObjectType[];
  currentIndex: number;
  results: CardResult[];
  isFlipped: boolean;
  isFinished: boolean;
}

interface UseCardsOptions {
  objects: ObjectType[];
  setId: string;
}

const STORAGE_KEY_PREFIX = "cards_progress_";

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getStorageKey = (setId: string) => `${STORAGE_KEY_PREFIX}${setId}`;

const getInitialState = (objects: ObjectType[], setId: string): CardsState => {
  const saved = localStorage.getItem(getStorageKey(setId));

  if (saved) {
    try {
      const parsed = JSON.parse(saved);

      if (
        parsed.objects &&
        Array.isArray(parsed.objects) &&
        parsed.objects.length === objects.length &&
        parsed.objects.every(
          (obj: ObjectType, index: number) => obj.id === objects[index]?.id,
        )
      ) {
        return {
          objects: parsed.objects,
          currentIndex: parsed.currentIndex,
          results: parsed.results,
          isFlipped: false,
          isFinished: parsed.isFinished || false,
        };
      }
    } catch (err) {}
  }

  const shuffled = shuffleArray(objects);
  return {
    objects: shuffled,
    currentIndex: 0,
    results: Array(objects.length).fill(null),
    isFlipped: false,
    isFinished: false,
  };
};

export const useCards = ({ objects, setId }: UseCardsOptions) => {
  const [state, setState] = useState<CardsState>(() =>
    getInitialState(objects, setId),
  );

  const prevObjectsRef = useRef<ObjectType[]>(objects);

  useEffect(() => {
    const prevObjects = prevObjectsRef.current;
    const currentObjects = objects;

    const hasChanged =
      prevObjects.length !== currentObjects.length ||
      prevObjects.some((obj, idx) => obj.id !== currentObjects[idx]?.id);

    if (hasChanged) {
      const shuffled = shuffleArray(currentObjects);
      setState({
        objects: shuffled,
        currentIndex: 0,
        results: Array(currentObjects.length).fill(null),
        isFlipped: false,
        isFinished: false,
      });
      localStorage.removeItem(getStorageKey(setId));
    }

    prevObjectsRef.current = currentObjects;
  }, [objects, setId]);

  useEffect(() => {
    const toSave = {
      objects: state.objects,
      currentIndex: state.currentIndex,
      results: state.results,
      isFinished: state.isFinished,
    };
    localStorage.setItem(getStorageKey(setId), JSON.stringify(toSave));
  }, [state, setId]);

  const currentObject = state.objects[state.currentIndex] || null;
  const total = state.objects.length;
  const answeredCount = state.results.filter((r) => r !== null).length;
  const rememberCount = state.results.filter((r) => r === "remember").length;
  const forgotCount = state.results.filter((r) => r === "forgot").length;
  const isComplete = state.isFinished || (total > 0 && answeredCount === total);

  const flipCard = useCallback(() => {
    setState((prev) => ({ ...prev, isFlipped: true }));
  }, []);

  const answer = useCallback((result: "remember" | "forgot") => {
    setState((prev) => {
      const newResults = [...prev.results];
      newResults[prev.currentIndex] = result;

      const nextIndex = prev.currentIndex + 1;
      const isFinished = nextIndex >= prev.objects.length;

      return {
        ...prev,
        results: newResults,
        currentIndex: isFinished ? prev.currentIndex : nextIndex,
        isFlipped: false,
        isFinished,
      };
    });
  }, []);

  const reset = useCallback(() => {
    const shuffled = shuffleArray(objects);

    setState({
      objects: shuffled,
      currentIndex: 0,
      results: Array(objects.length).fill(null),
      isFlipped: false,
      isFinished: false,
    });
    localStorage.removeItem(getStorageKey(setId));
  }, [objects, setId]);

  const goToNext = useCallback(() => {
    if (state.currentIndex < state.objects.length - 1) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isFlipped: false,
      }));
    }
  }, [state.currentIndex, state.objects.length]);

  const goToPrevious = useCallback(() => {
    if (state.currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isFlipped: false,
      }));
    }
  }, [state.currentIndex]);

  return {
    currentObject,
    currentIndex: state.currentIndex,
    total,
    results: state.results,
    isFlipped: state.isFlipped,
    isComplete,
    answeredCount,
    rememberCount,
    forgotCount,
    flipCard,
    answer,
    reset,
    goToNext,
    goToPrevious,
  };
};
