import { useState, useCallback } from "react";
import type { FieldDefinition } from "@/entities/set/model/types";
import { setApi } from "@/entities/set/api/setApi";

export interface ManualObjectData {
  id: string;
  imageFile: File | null;
  imagePreview: string | null;
  fieldValues: Record<string, string>;
  errors: string[];
}

interface UseManualImportOptions {
  fields: FieldDefinition[];
  setId: string;
  onFieldsUpdate: (fields: FieldDefinition[]) => void;
}

export const useManualImport = ({
  fields,
  setId,
  onFieldsUpdate,
}: UseManualImportOptions) => {
  const [objects, setObjects] = useState<ManualObjectData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addImages = useCallback(
    (files: File[]) => {
      const newObjects: ManualObjectData[] = files.map((file) => {
        const preview = URL.createObjectURL(file);
        const fieldValues: Record<string, string> = {};
        fields.forEach((f) => {
          fieldValues[f.id] = "";
        });
        return {
          id: `obj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          imageFile: file,
          imagePreview: preview,
          fieldValues,
          errors: [],
        };
      });

      setObjects((prev) => [...prev, ...newObjects]);
    },
    [fields],
  );

  const removeObject = useCallback((id: string) => {
    setObjects((prev) => {
      const removed = prev.find((o) => o.id === id);

      if (removed?.imagePreview) {
        URL.revokeObjectURL(removed.imagePreview);
      }

      return prev.filter((o) => o.id !== id);
    });
  }, []);

  const updateFieldValue = useCallback(
    (objectId: string, fieldId: string, value: string) => {
      setObjects((prev) =>
        prev.map((obj) => {
          if (obj.id === objectId) {
            const newFieldValues = { ...obj.fieldValues, [fieldId]: value };

            return { ...obj, fieldValues: newFieldValues };
          }

          return obj;
        }),
      );
    },
    [],
  );

  const addField = useCallback(
    async (fieldName: string) => {
      const existing = fields.find(
        (f) => f.name.toLowerCase() === fieldName.trim().toLowerCase(),
      );

      if (existing) {
        throw new Error(`Поле с именем "${fieldName}" уже существует`);
      }

      if (!fieldName.trim()) {
        throw new Error("Название поля не может быть пустым");
      }

      const newField: FieldDefinition = {
        id: `field-${Date.now()}`,
        name: fieldName.trim(),
        order: fields.length,
      };

      const updatedFields = [...fields, newField];
      await setApi.updateSet(setId, { fields: updatedFields });

      onFieldsUpdate(updatedFields);

      setObjects((prev) =>
        prev.map((obj) => ({
          ...obj,
          fieldValues: { ...obj.fieldValues, [newField.id]: "" },
        })),
      );

      return newField;
    },
    [fields, setId, onFieldsUpdate],
  );

  const validateAll = useCallback((): boolean => {
    let allValid = true;

    setObjects((prev) =>
      prev.map((obj) => {
        const errors: string[] = [];

        for (const fieldId of Object.keys(obj.fieldValues)) {
          const value = obj.fieldValues[fieldId]?.trim() || "";

          if (!value) {
            errors.push(
              `Заполните поле "${fields.find((f) => f.id === fieldId)?.name || fieldId}"`,
            );
          }
        }

        if (!obj.imageFile) {
          errors.push("Изображение не загружено");
        }

        return { ...obj, errors };
      }),
    );

    setObjects((prev) => {
      const hasErrors = prev.some((obj) => obj.errors.length > 0);
      if (hasErrors) allValid = false;

      return prev;
    });

    return allValid;
  }, [fields]);

  const saveAll = useCallback(
    async (
      createObjectFn: (dto: any) => Promise<any>,
      saveImageFn: (id: string, file: File) => Promise<void>,
    ) => {
      if (!validateAll()) {
        throw new Error("Есть ошибки в данных");
      }

      setIsSaving(true);

      try {
        const createdObjects = [];

        for (const obj of objects) {
          const fieldEntries = Object.entries(obj.fieldValues).map(
            ([fieldId, value]) => {
              const field = fields.find((f) => f.id === fieldId);

              return {
                fieldId,
                fieldName: field?.name || "",
                value: value.trim(),
              };
            },
          );

          const newObject = await createObjectFn({
            fields: fieldEntries,
          });

          if (obj.imageFile) {
            await saveImageFn(newObject.id, obj.imageFile);
          }

          createdObjects.push(newObject);
        }

        objects.forEach((obj) => {
          if (obj.imagePreview) {
            URL.revokeObjectURL(obj.imagePreview);
          }
        });
        setObjects([]);

        return createdObjects;
      } finally {
        setIsSaving(false);
      }
    },
    [objects, fields, validateAll],
  );

  const resetAll = useCallback(() => {
    objects.forEach((obj) => {
      if (obj.imagePreview) {
        URL.revokeObjectURL(obj.imagePreview);
      }
    });

    setObjects([]);
  }, [objects]);

  return {
    objects,
    isSaving,
    addImages,
    removeObject,
    updateFieldValue,
    addField,
    validateAll,
    saveAll,
    resetAll,
  };
};
