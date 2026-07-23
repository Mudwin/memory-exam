import { useParams, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { useSet } from "@/entities/set/model/useSet";
import { useImport } from "@/features/import/model/useImport";
import { objectApi } from "@/entities/object/api/objectApi";
import { saveImage } from "@/shared/lib/indexedDB";
import { useToastContext } from "@/app/providers/ToastProvider";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import styles from "./ImportTablePage.module.css";

const ImportTablePage = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { set, isLoading, refresh } = useSet(setId);
  const { showSuccess, showError } = useToastContext();

  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { state, parseFile, addImageFiles, reset, canImport } = useImport({
    fields: set?.fields || [],
    setId: setId || "",
  });

  const handleTableFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await parseFile(file);
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    addImageFiles(fileArray);
    showSuccess(`Загружено ${fileArray.length} изображений`);
  };

  const handleImport = async () => {
    if (!canImport()) return;
    if (!setId) return;

    setIsImporting(true);

    try {
      const { previewRows, fieldMapping, imageColumnName } = state;

      const createPromises = previewRows.map(async (row) => {
        const fields = Object.entries(row.fieldValues).map(
          ([fieldId, value]) => ({
            fieldId,
            fieldName: set?.fields?.find((f) => f.id === fieldId)?.name || "",
            value,
          }),
        );

        const newObject = await objectApi.createObject(setId, {
          fields,
        });

        if (row.imageFile) {
          await saveImage(newObject.id, row.imageFile);
        }

        return newObject;
      });

      const created = await Promise.all(createPromises);

      showSuccess(`Успешно импортировано ${created.length} объектов`);
      await refresh();

      navigate(`/collections/${setId}`);
    } catch (error) {
      console.error("Ошибка импорта", error);
      showError("Не удалось импортировать данные");
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
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

  if (!set.fields || set.fields.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Нет полей в наборе"
          description="Сначала добавьте поля в наборе, чтобы импортировать данные"
          actionButton={
            <Button
              buttonType="save"
              onClick={() => navigate(`/collections/${setId}`)}
            >
              Вернуться к набору
            </Button>
          }
        />
      </div>
    );
  }

  const hasPreview = state.previewRows.length > 0;
  const showValidationErrors = state.validationErrors.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Импорт из таблицы</h1>
        <p className={styles.subtitle}>
          Загрузите CSV или Excel файл с данными и изображения для массового
          добавления объектов
        </p>
      </div>

      <div className={styles.infoPanel}>
        <h3 className={styles.infoTitle}>Как подготовить файл</h3>
        <ul className={styles.infoList}>
          <li>Первая строка — заголовки полей (названия полей набора)</li>
          <li>
            Обязательная колонка с названием <strong>"image"</strong> или{" "}
            <strong>"filename"</strong> — содержит имена файлов изображений (с
            расширением)
          </li>
          <li>Каждая последующая строка — один объект</li>
          <li>Имена файлов должны совпадать с именами в колонке</li>
          <li>Поддерживаются форматы: .csv, .xlsx</li>
        </ul>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.uploadGroup}>
          <h3 className={styles.uploadLabel}>1. Таблица с данными</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleTableFileChange}
            className={styles.fileInput}
          />
          {state.tableFile && (
            <p className={styles.uploadedFile}>
              Загружен: {state.tableFile.name}
            </p>
          )}
        </div>

        <div className={styles.uploadGroup}>
          <h3 className={styles.uploadLabel}>2. Изображения</h3>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFilesChange}
            className={styles.fileInput}
          />
          {state.imageFiles.length > 0 && (
            <p className={styles.uploadedFile}>
              Загружено: {state.imageFiles.length} файлов
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <div className={styles.errorBanner}>
          <p>{state.error}</p>
        </div>
      )}

      {showValidationErrors && (
        <div className={styles.validationErrors}>
          <h4>Ошибки в файле:</h4>
          <ul>
            {state.validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {state.validationWarnings.length > 0 && (
        <div className={styles.validationWarnings}>
          <h4>Предупреждения:</h4>
          <ul>
            {state.validationWarnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {hasPreview && (
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>
            Предпросмотр ({state.previewRows.length} объектов)
          </h3>
          <div className={styles.tableWrapper}>
            <table className={styles.previewTable}>
              <thead>
                <tr>
                  <th>#</th>
                  {state.imageColumnName && <th>Изображение</th>}
                  {Object.keys(state.fieldMapping).map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {state.previewRows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.errors.length > 0 ? styles.rowError : ""}
                  >
                    <td>{row.rowIndex + 1}</td>
                    {state.imageColumnName && (
                      <td>
                        {row.imageFileName && (
                          <span
                            className={
                              row.imageExists
                                ? styles.imageOk
                                : styles.imageMissing
                            }
                          >
                            {row.imageFileName}
                          </span>
                        )}
                        {!row.imageFileName && (
                          <span className={styles.imageMissing}>—</span>
                        )}
                      </td>
                    )}
                    {Object.keys(state.fieldMapping).map((header) => (
                      <td key={header}>{row.data[header] || "—"}</td>
                    ))}
                    <td>
                      {row.errors.length > 0 && (
                        <span className={styles.statusError}>Ошибка</span>
                      )}
                      {row.warnings.length > 0 && (
                        <span className={styles.statusWarning}>
                          Предупреждение
                        </span>
                      )}
                      {row.errors.length === 0 && row.warnings.length === 0 && (
                        <span className={styles.statusOk}>OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          buttonType="save"
          onClick={handleImport}
          disabled={!canImport() || isImporting}
        >
          Импортировать
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
  );
};

export default ImportTablePage;
