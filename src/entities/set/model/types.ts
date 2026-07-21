import type { ObjectType } from "@/entities/object/model/types";

export type Visibility = "private" | "public";

export interface SetType {
  id: string;
  title: string;
  description?: string;
  visibility: Visibility;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  objectCount: number;
  objects?: ObjectType[];
}

export interface CreateSetDto {
  title: string;
  description?: string;
  visibility: Visibility;
}

export interface UpdateSetDto {
  title?: string;
  description?: string;
  visibility?: Visibility;
}

export interface SetPublicSettings {
  allowCards: boolean;
  allowTests: boolean;
  allowExam: boolean;
  allowAnswers: boolean;
  requireAuth: boolean;
}
