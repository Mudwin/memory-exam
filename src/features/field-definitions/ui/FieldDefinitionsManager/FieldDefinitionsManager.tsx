import { useState } from "react";
import type { FieldDefinition } from "@/entities/set/model/types";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import styles from "./FieldDefinitionsManager.module.css";

interface FieldDefinitionsManagerProps {
  fields: FieldDefinition[];
  onSave: (fields: FieldDefinition[]) => Promise<void>;
  isReadOnly?: boolean;
}

const FieldDefinitionsManager = ({
  fields: initialFields,
  onSave,
  isReadOnly = false,
}: FieldDefinitionsManagerProps) => {
  const [fields, setFields] = useState<FieldDefinition[]>(initialFields);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addField = () => {
    const newField: FieldDefinition = {
      id: `field-${Date.now()}`,
      name: "",
      order: fields.length,
    };
    setFields((prev) => [...prev, newField]);
    setEditingId(newField.id);
  };

  const updateFieldName = (id: string, name: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  };

  const removeField = (id: string) => {
    setFields((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      return filtered.map((f, index) => ({ ...f, order: index }));
    });

    if (editingId === id) setEditingId(null);
  };

  const moveFieldUp = (id: string) => {
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
  };

  const moveFieldDown = (id: string) => {
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
  };

  const handleSave = async () => {
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
  };

  if (isReadOnly) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Поля набора</h3>

        {fields.length === 0 ? (
          <p className={styles.empty}>Поля не определены</p>
        ) : (
          <ul className={styles.list}>
            {fields.map((field) => (
              <li key={field.id} className={styles.fieldItem}>
                <span className={styles.fieldName}>{field.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Управление полями</h3>
        <Button buttonType="save" onClick={addField}>
          + Добавить поле
        </Button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {fields.length === 0 ? (
        <p className={styles.empty}>
          Поля не добавлены. Нажмите «Добавить поле».
        </p>
      ) : (
        <ul className={styles.list}>
          {fields.map((field) => (
            <li key={field.id} className={styles.fieldItem}>
              <div className={styles.fieldRow}>
                <div className={styles.fieldInput}>
                  <Input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateFieldName(field.id, e.target.value)}
                    placeholder="Название поля"
                    className={styles.input}
                  />
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.moveButton}
                    onClick={() => moveFieldUp(field.id)}
                    disabled={field.order === 0}
                    aria-label="Вверх"
                  >
                    ↑
                  </button>
                  <button
                    className={styles.moveButton}
                    onClick={() => moveFieldDown(field.id)}
                    disabled={field.order === fields.length - 1}
                    aria-label="Вниз"
                  >
                    ↓
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => removeField(field.id)}
                    aria-label="Удалить"
                  >
                    ×
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.footer}>
        <Button buttonType="save" onClick={handleSave} disabled={isSaving}>
          Сохранить поля
        </Button>
      </div>
    </div>
  );
};

export default FieldDefinitionsManager;
