import { useState, useCallback } from "react";
import type { FieldDefinition } from "@/entities/set/model/types";

export const useFieldDefinitions = (
  initialFields: FieldDefinition[] = [],
  onSave: (fields: FieldDefinition[]) => Promise<void>,
) => {
  const [fields, setFields] = useState<FieldDefinition[]>(initialFields);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addField = useCallback(() => {
    const newField: FieldDefinition = {
      id: `field-${Date.now()}`,
      name: "",
      order: fields.length,
    };

    setFields((prev) => [...prev, newField]);
  }, [fields.length]);

  const updateFieldName = useCallback((id: string, name: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const removeField = useCallback((id: string) => {
    setFields((prev) => {
      const filtered = prev.filter((f) => f.id !== id);

      return filtered.map((f, index) => ({ ...f, order: index }));
    });
  }, []);

  const moveFieldUp = useCallback((id: string) => {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index <= 0) return prev;

      const newFields = [...prev];
      [newFields[index - 1], newFields[index]] = [
        newFields[index],
        newFields[index - 1],
      ];

      return newFields.map((f, idx) => ({ ...f, order: idx }));
    });
  }, []);

  const moveFieldDown = useCallback((id: string) => {
    setFields((prev) => {
      const index = prev.findIndex((f) => f.id === id);

      if (index === -1 || index >= prev.length - 1) return prev;

      const newFields = [...prev];
      [newFields[index + 1], newFields[index]] = [
        newFields[index],
        newFields[index + 1],
      ];

      return newFields.map((f, idx) => ({ ...f, order: idx }));
    });
  }, []);

  const saveFields = useCallback(async () => {
    const invalid = fields.some((f) => !f.name.trim());

    if (invalid) {
      setError("Все поля должны иметь название");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave(fields);
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения полей");
    } finally {
      setIsSaving(false);
    }
  }, [fields, onSave]);

  const reset = useCallback((newFields: FieldDefinition[]) => {
    setFields(newFields);
  }, []);

  return {
    fields,
    isSaving,
    error,
    addField,
    updateFieldName,
    removeField,
    moveFieldUp,
    moveFieldDown,
    saveFields,
    reset,
  };
};
