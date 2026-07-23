import type { ObjectType } from "@/entities/object/model/types";
import type { FieldDefinition } from "@/entities/set/model/types";

export interface ExamQuestion {
  id: string;
  fieldId: string;
  fieldName: string;
  correctAnswer: string;
  options: string[];
  userAnswerIndex: number | null;
  isCorrect: boolean | null;
}

export interface ExamConfig {
  questionCount: number;
  selectedFieldIds: string[];
}

export interface UseExamOptions {
  objects: ObjectType[];
  fields: FieldDefinition[];
}
