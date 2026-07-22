import type { ObjectType } from "@/entities/object/model/types";

export type Visibility = "private" | "public";

export interface FieldDefinition {
  id: string;
  name: string;
  order: number;
}

export interface SetType {
  id: string;
  shareId?: string;
  title: string;
  description?: string;
  visibility: Visibility;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  objectCount: number;
  objects?: ObjectType[];
  fields: FieldDefinition[];
}

export interface CreateSetDto {
  title: string;
  description?: string;
  visibility: Visibility;
  fields?: FieldDefinition[];
}

export interface UpdateSetDto {
  title?: string;
  description?: string;
  visibility?: Visibility;
  fields?: FieldDefinition[];
}

export interface SetPublicSettings {
  allowCards: boolean;
  allowTests: boolean;
  allowExam: boolean;
  allowAnswers: boolean;
  requireAuth: boolean;
}
