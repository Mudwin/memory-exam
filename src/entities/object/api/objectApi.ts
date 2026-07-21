import { apiClient } from "@/shared/api/apiClient";
import type {
  ObjectType,
  CreateObjectDto,
  UpdateObjectDto,
} from "../model/types";

export const objectApi = {
  getObjects: async (setId: string): Promise<ObjectType[]> => {
    const { data } = await apiClient.get<ObjectType[]>(
      `/sets/${setId}/objects`,
    );

    return data;
  },

  createObject: async (
    setId: string,
    dto: CreateObjectDto,
  ): Promise<ObjectType> => {
    const formData = new FormData();

    formData.append("fields", JSON.stringify(dto.fields));

    if (dto.image) {
      formData.append("image", dto.image);
    }

    const { data } = await apiClient.post<ObjectType>(
      `/sets/${setId}/objects`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },

  updateObject: async (
    id: string,
    dto: UpdateObjectDto,
  ): Promise<ObjectType> => {
    const formData = new FormData();

    if (dto.fields) {
      formData.append("fields", JSON.stringify(dto.fields));
    }

    if (dto.image) {
      formData.append("image", dto.image);
    }

    const { data } = await apiClient.put<ObjectType>(
      `/objects/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },

  deleteObject: async (id: string): Promise<void> => {
    await apiClient.delete(`/objects/${id}`);
  },

  getObjectImage: async (id: string): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(`/objects/${id}/image`, {
      responseType: "blob",
    });

    return data;
  },
};
