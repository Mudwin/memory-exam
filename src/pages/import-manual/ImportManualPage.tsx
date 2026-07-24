import { useParams, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { useManualImport } from "@/features/import-manual/model/useManualImport";
import { objectApi } from "@/entities/object/api/objectApi";
import { saveImage } from "@/shared/lib/indexedDB";
import { useToastContext } from "@/app/providers/ToastProvider";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import EmptyState from "@/shared/ui/EmptyState";
import styles from "./ImportManualPage.module.css";

const ImportManualPage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, isLoading, refresh } = useSet(setId);
  const { showSuccess, showError } = useToastContext();

  const [newFieldName, setNewFieldName] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    objects,
    isSaving,
    addImages,
    removeObject,
    updateFieldValue,
    addField,
    validateAll,
    saveAll,
    resetAll,
  } = useManualImport({
    fields: set?.fields || [],
    setId: setId || "",
    onFieldsUpdate: (newFields) => {
      if (set) {
        set.fields = newFields;
      }
    },
  });

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    addImages(fileArray);
    showSuccess(`Добавлено ${fileArray.length} изображений`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddField = async () => {
    if (!newFieldName.trim()) {
      showError("Введите название поля");
      return;
    }
    setIsAddingField(true);
    try {
      await addField(newFieldName);

      setNewFieldName("");
      showSuccess(`Поле "${newFieldName}" добавлено`);

      await refresh();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Ошибка добавления поля");
    } finally {
      setIsAddingField(false);
    }
  };

  const handleSave = async () => {
    try {
      const created = await saveAll(
        (dto) => objectApi.createObject(setId!, dto),
        saveImage,
      );
      showSuccess(`Создано ${created.length} объектов`);

      await refresh();
      navigate(`/collections/${setId}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const handleReset = () => {
    resetAll();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (isLoading) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.loadingText}>Загрузка...</p>
      </div>
    );
  }

  if (!set) {
    return (
      <div className={styles.centerMessage}>
        <p className={styles.errorText}>Набор не найден</p>
        <Button buttonType="save" onClick={() => navigate("/collections")}>
          Вернуться к списку
        </Button>
      </div>
    );
  }

  const fields = set.fields || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Массовый импорт</h1>
        <p className={styles.subtitle}>
          Загрузите несколько изображений и заполните поля для каждого объекта
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.uploadGroup}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            className={styles.fileInput}
          />
          <Button
            buttonType="save"
            onClick={() => fileInputRef.current?.click()}
          >
            + Загрузить изображения
          </Button>
        </div>

        <div className={styles.fieldAddGroup}>
          <Input
            type="text"
            placeholder="Новое поле"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className={styles.fieldInput}
          />
          <Button
            buttonType="save"
            onClick={handleAddField}
            disabled={isAddingField || !newFieldName.trim()}
          >
            Добавить поле
          </Button>
        </div>

        <div className={styles.actions}>
          <Button
            buttonType="save"
            onClick={handleSave}
            disabled={objects.length === 0 || isSaving}
          >
            Сохранить ({objects.length})
          </Button>
          <button className={styles.resetButton} onClick={handleReset}>
            Сбросить
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => navigate(`/collections/${setId}`)}
          >
            Отмена
          </button>
        </div>
      </div>

      {fields.length === 0 && (
        <div className={styles.noFieldsWarning}>
          <p>
            В наборе нет полей. Добавьте поле выше, чтобы начать заполнение.
          </p>
        </div>
      )}

      {objects.length === 0 ? (
        <EmptyState
          title="Нет объектов"
          description="Загрузите изображения, чтобы начать создание объектов"
        />
      ) : (
        <div className={styles.objectsGrid}>
          {objects.map((obj) => (
            <div key={obj.id} className={styles.objectCard}>
              <div className={styles.imageContainer}>
                {obj.imagePreview ? (
                  <img src={obj.imagePreview} alt="Объект" />
                ) : (
                  <div className={styles.placeholderImage}>Нет изображения</div>
                )}
                <button
                  className={styles.removeButton}
                  onClick={() => removeObject(obj.id)}
                  title="Удалить"
                >
                  ×
                </button>
              </div>

              <div className={styles.fieldsContainer}>
                {fields.map((field) => (
                  <div key={field.id} className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>{field.name}</label>
                    <Input
                      type="text"
                      value={obj.fieldValues[field.id] || ""}
                      onChange={(e) =>
                        updateFieldValue(obj.id, field.id, e.target.value)
                      }
                      placeholder={`Введите ${field.name}`}
                      className={styles.fieldInput}
                    />
                  </div>
                ))}
              </div>

              {obj.errors.length > 0 && (
                <div className={styles.errorList}>
                  {obj.errors.map((err, idx) => (
                    <span key={idx} className={styles.errorItem}>
                      {err}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImportManualPage;
