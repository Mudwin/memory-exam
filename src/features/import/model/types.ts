import type { FieldDefinition } from "@/entities/set/model/types";
import { type ParsedRow } from "../lib/parseTableFile";

export interface ImportPreviewRow {
  id: string;
  rowIndex: number;
  data: ParsedRow;
  imageFileName: string | null;
  imageFile?: File;
  imageExists: boolean;
  errors: string[];
  warnings: string[];
  fieldValues: Record<string, string>;
}

export interface ImportState {
  tableFile: File | null;
  imageFiles: File[];
  previewRows: ImportPreviewRow[];
  isParsing: boolean;
  isImporting: boolean;
  error: string | null;
  validationErrors: string[];
  validationWarnings: string[];
  fieldMapping: Record<string, string>;
  imageColumnName: string | null;
}

export interface UseImportOptions {
  fields: FieldDefinition[];
  setId: string;
}
