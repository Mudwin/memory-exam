import type { FieldDefinition } from "@/entities/set/model/types";

export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldMapping: Record<string, string>;
  imageColumnName: string | null;
}

export const validateImportData = (
  headers: string[],
  fields: FieldDefinition[],
  requiredImageColumn: boolean = true,
): ImportValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const fieldMapping: Record<string, string> = {};
  let imageColumnName: string | null = null;

  if (headers.length === 0) {
    errors.push("Файл не содержит заголовков");
    return { isValid: false, errors, warnings, fieldMapping, imageColumnName };
  }

  const fieldMap = new Map<string, FieldDefinition>();
  fields.forEach((f) => {
    fieldMap.set(f.name.toLowerCase(), f);
  });

  headers.forEach((header) => {
    const trimmed = header.trim();
    if (!trimmed) {
      warnings.push("Обнаружен пустой заголовок, он будет пропущен");
      return;
    }

    const imageKeywords = [
      "image",
      "filename",
      "file",
      "img",
      "picture",
      "photo",
      "изображение",
      "файл",
      "имя файла",
    ];

    if (imageKeywords.some((kw) => trimmed.toLowerCase() === kw)) {
      if (imageColumnName) {
        errors.push(
          `Обнаружено несколько колонок для изображений: "${imageColumnName}" и "${trimmed}"`,
        );
      } else {
        imageColumnName = trimmed;
      }
      return;
    }

    const field = fieldMap.get(trimmed.toLowerCase());
    if (!field) {
      errors.push(
        `Колонка "${trimmed}" не соответствует ни одному полю набора`,
      );
    } else {
      fieldMapping[trimmed] = field.id;
    }
  });

  if (requiredImageColumn && !imageColumnName) {
    errors.push(
      "Не найдена колонка для изображений. Убедитесь, что в таблице есть колонка с названием 'image', 'filename' или аналогичным.",
    );
  }

  const mappedFieldCount = Object.keys(fieldMapping).length;
  if (mappedFieldCount === 0 && !imageColumnName) {
    errors.push("Не сопоставлено ни одной колонки с полями набора");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    fieldMapping,
    imageColumnName,
  };
};
