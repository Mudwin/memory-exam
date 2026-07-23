import * as XLSX from "xlsx";

export interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

export interface ParsedTableData {
  headers: string[];
  rows: ParsedRow[];
  fileName: string;
}

export const parseTableFile = (file: File): Promise<ParsedTableData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error("Не удалось прочитать файл"));
          return;
        }

        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        let workbook: XLSX.WorkBook;

        if (fileExtension === "csv") {
          const csvData = data as string;
          workbook = XLSX.read(csvData, { type: "string", raw: true });
        } else {
          const arrayBuffer = data as ArrayBuffer;
          workbook = XLSX.read(arrayBuffer, { type: "array", raw: true });
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(
          worksheet,
          {
            defval: "",
            raw: false,
          },
        );

        if (jsonData.length === 0) {
          reject(new Error("Файл пуст или не содержит данных"));
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const rows: ParsedRow[] = jsonData.map((row) => {
          const parsedRow: ParsedRow = {};
          headers.forEach((header) => {
            parsedRow[header] = row[header] !== undefined ? row[header] : null;
          });
          return parsedRow;
        });

        resolve({
          headers,
          rows,
          fileName: file.name,
        });
      } catch (error) {
        reject(
          new Error(
            `Ошибка парсинга файла: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Не удалось прочитать файл"));
    };

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension === "csv") {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
};
