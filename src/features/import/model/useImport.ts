import { useState, useCallback } from "react";
import { parseTableFile } from "../lib/parseTableFile";
import { validateImportData } from "../lib/validateImportData";
import type { ImportState, ImportPreviewRow, UseImportOptions } from "./types";

export const useImport = ({ fields, setId }: UseImportOptions) => {
  const [state, setState] = useState<ImportState>({
    tableFile: null,
    imageFiles: [],
    previewRows: [],
    isParsing: false,
    isImporting: false,
    error: null,
    validationErrors: [],
    validationWarnings: [],
    fieldMapping: {},
    imageColumnName: null,
  });

  const parseFile = useCallback(
    async (file: File) => {
      setState((prev) => ({ ...prev, isParsing: true, error: null }));

      try {
        const parsed = await parseTableFile(file);

        const validation = validateImportData(parsed.headers, fields, true);

        if (!validation.isValid) {
          setState((prev) => ({
            ...prev,
            isParsing: false,
            validationErrors: validation.errors,
            validationWarnings: validation.warnings,
            error: "Ошибка валидации файла",
          }));
          return;
        }

        const previewRows: ImportPreviewRow[] = parsed.rows.map(
          (row, index) => {
            const fieldValues: Record<string, string> = {};
            const errors: string[] = [];
            const warnings: string[] = [];

            Object.keys(validation.fieldMapping).forEach((header) => {
              const fieldId = validation.fieldMapping[header];
              const value = row[header]?.toString() || "";

              if (!value.trim()) {
                warnings.push(`Поле "${header}" пустое`);
              }

              fieldValues[fieldId] = value;
            });

            let imageFileName: string | null = null;

            if (validation.imageColumnName) {
              const raw = row[validation.imageColumnName];
              imageFileName = raw ? String(raw).trim() : null;

              if (!imageFileName) {
                errors.push("Отсутствует имя файла изображения");
              }
            }

            return {
              id: `row-${index}`,
              rowIndex: index,
              data: row,
              imageFileName,
              imageFile: undefined,
              imageExists: false,
              errors,
              warnings,
              fieldValues,
            };
          },
        );

        setState((prev) => ({
          ...prev,
          tableFile: file,
          previewRows,
          validationErrors: validation.errors,
          validationWarnings: validation.warnings,
          fieldMapping: validation.fieldMapping,
          imageColumnName: validation.imageColumnName,
          isParsing: false,
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isParsing: false,
          error:
            error instanceof Error ? error.message : "Ошибка парсинга файла",
          validationErrors: [],
          validationWarnings: [],
        }));
      }
    },
    [fields],
  );

  const addImageFiles = useCallback((files: File[]) => {
    setState((prev) => {
      const newImageFiles = [...prev.imageFiles, ...files];

      const updatedPreview = prev.previewRows.map((row) => {
        if (!row.imageFileName) return row;

        const matchedFile = files.find((f) => f.name === row.imageFileName);
        if (matchedFile) {
          return { ...row, imageFile: matchedFile, imageExists: true };
        }
        return row;
      });

      return {
        ...prev,
        imageFiles: newImageFiles,
        previewRows: updatedPreview,
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      tableFile: null,
      imageFiles: [],
      previewRows: [],
      isParsing: false,
      isImporting: false,
      error: null,
      validationErrors: [],
      validationWarnings: [],
      fieldMapping: {},
      imageColumnName: null,
    });
  }, []);

  const canImport = useCallback(() => {
    if (state.previewRows.length === 0) return false;
    if (state.isImporting) return false;
    if (state.validationErrors.length > 0) return false;

    if (state.imageColumnName) {
      const missingImages = state.previewRows.some(
        (row) => row.imageFileName && !row.imageExists,
      );
      if (missingImages) return false;
    }

    return true;
  }, [state]);

  return {
    state,
    parseFile,
    addImageFiles,
    reset,
    canImport,
  };
};
