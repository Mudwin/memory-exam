import { useState, useEffect, useCallback } from "react";
import { setApi } from "../api/setApi";
import { objectApi } from "@/entities/object/api/objectApi";
import { getImage } from "@/shared/lib/indexedDB";
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

      setSet(setData);
      setObjects(objectsWithImages);
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
