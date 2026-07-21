import { useState, useEffect, useCallback } from "react";
import { setApi } from "../api/setApi";
import type { SetType, CreateSetDto } from "./types";

export const useSets = () => {
  const [sets, setSets] = useState<SetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await setApi.getUserSets();
      setSets(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка загрузки наборов");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSet = useCallback(async (dto: CreateSetDto) => {
    setError(null);

    try {
      const newSet = await setApi.createSet(dto);
      setSets((prev) => [newSet, ...prev]);
      return newSet;
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка создания набора");
      throw err;
    }
  }, []);

  const deleteSet = useCallback(async (id: string) => {
    setError(null);

    try {
      await setApi.deleteSet(id);
      setSets((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка удаления набора");
      throw err;
    }
  }, []);

  const updateSet = useCallback(async (id: string, dto: any) => {
    setError(null);

    try {
      const updated = await setApi.updateSet(id, dto);
      setSets((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка обновления набора");
      throw err;
    }
  }, []);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  return {
    sets,
    isLoading,
    error,
    loadSets,
    createSet,
    deleteSet,
    updateSet,
  };
};
