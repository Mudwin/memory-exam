import type { ObjectType } from "@/entities/object/model/types";
import type { FieldDefinition } from "@/entities/set/model/types";

export interface TestQuestion {
  id: string;
  fieldId: string;
  fieldName: string;
  correctAnswer: string;
  options: string[];
  userAnswerIndex: number | null;
  isCorrect: boolean | null;
}

export type TestState = {
  questions: TestQuestion[];
  currentIndex: number;
  selectedFieldId: string | null;
  isFinished: boolean;
  startedAt: string;
};

export interface UseTestOptions {
  objects: ObjectType[];
  fields: FieldDefinition[];
  setId: string;
}
