import { useState, useEffect, useCallback } from "react";
import { setApi } from "../api/setApi";
import { objectApi } from "@/entities/object/api/objectApi";
import type { SetType } from "./types";
import type { ObjectType } from "@/entities/object/model/types";

export const useSet = (setId: string | undefined) => {
  const [set, setSet] = useState<SetType | null>(null);
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSet = useCallback(async () => {
    if (!setId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [setData, objectsData] = await Promise.all([
        setApi.getSetById(setId),
        objectApi.getObjects(setId),
      ]);

      setSet(setData);
      setObjects(objectsData);
    } catch (err: any) {
      setError(err.response?.data?.error || "Ошибка загрузки набора");
    } finally {
      setIsLoading(false);
    }
  }, [setId]);

  const refresh = useCallback(() => {
    loadSet();
  }, [loadSet]);

  useEffect(() => {
    loadSet();
  }, [loadSet]);

  return {
    set,
    objects,
    isLoading,
    error,
    refresh,
  };
};
