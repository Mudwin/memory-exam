export interface FieldValue {
  fieldId: string;
  fieldName: string;
  value: string;
}

export interface ObjectType {
  id: string;
  setId: string;
  fields: FieldValue[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateObjectDto {
  fields: FieldValue[];
  image?: File;
}

export interface UpdateObjectDto {
  fields?: FieldValue[];
  image?: File;
}
