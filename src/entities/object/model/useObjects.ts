import { useState, useCallback } from "react";
import { objectApi } from "../api/objectApi";
import { getImage, saveImage, deleteImage } from "@/shared/lib/indexedDB";
import type { ObjectType, CreateObjectDto, UpdateObjectDto } from "./types";

export const useObjects = (
  setId: string,
  initialObjects: ObjectType[] = [],
) => {
  const [objects, setObjects] = useState<ObjectType[]>(initialObjects);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImageForObject = useCallback(
    async (object: ObjectType): Promise<ObjectType> => {
      try {
        const blob = await getImage(object.id);

        if (blob) {
          const url = URL.createObjectURL(blob);
          return { ...object, imageUrl: url };
        }
      } catch (err) {}

      return object;
    },
    [],
  );

  const loadImagesForObjects = useCallback(
    async (objectsList: ObjectType[]): Promise<ObjectType[]> => {
      const withImages = await Promise.all(objectsList.map(loadImageForObject));
      return withImages;
    },
    [loadImageForObject],
  );

  const createObject = useCallback(
    async (dto: CreateObjectDto): Promise<ObjectType> => {
      setIsLoading(true);
      setError(null);

      try {
        const newObject = await objectApi.createObject(setId, dto);

        if (dto.image) {
          await saveImage(newObject.id, dto.image);
          const url = URL.createObjectURL(dto.image);
          newObject.imageUrl = url;
        }

        setObjects((prev) => [...prev, newObject]);

        return newObject;
      } catch (err: any) {
        setError(err.response?.data?.error || "Ошибка создания объекта");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setId],
  );

  const updateObject = useCallback(
    async (id: string, dto: UpdateObjectDto): Promise<ObjectType> => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await objectApi.updateObject(id, dto);

        if (dto.image) {
          await saveImage(id, dto.image);
          const url = URL.createObjectURL(dto.image);
          updated.imageUrl = url;
        }

        setObjects((prev) =>
          prev.map((obj) => (obj.id === id ? updated : obj)),
        );

        return updated;
      } catch (err: any) {
        setError(err.response?.data?.error || "Ошибка обновления объекта");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteObject = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await objectApi.deleteObject(id);
        await deleteImage(id);
        setObjects((prev) => prev.filter((obj) => obj.id !== id));

        const obj = objects.find((o) => o.id === id);

        if (obj?.imageUrl) {
          URL.revokeObjectURL(obj.imageUrl);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Ошибка удаления объекта");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [objects],
  );

  const loadObjectImage = useCallback(
    async (id: string): Promise<string | null> => {
      try {
        const blob = await getImage(id);

        if (blob) {
          const url = URL.createObjectURL(blob);
          return url;
        }

        return null;
      } catch (err) {
        return null;
      }
    },
    [],
  );

  return {
    objects,
    isLoading,
    error,
    createObject,
    updateObject,
    deleteObject,
    loadImagesForObjects,
    loadObjectImage,
    setObjects,
  };
};
