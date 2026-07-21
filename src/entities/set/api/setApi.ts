import { apiClient } from "@/shared/api/apiClient";

import type {
  SetType,
  CreateSetDto,
  UpdateSetDto,
  SetPublicSettings,
} from "../model/types";

export const setApi = {
  getUserSets: async (): Promise<SetType[]> => {
    const { data } = await apiClient.get<SetType[]>("/sets");
    return data;
  },

  createSet: async (dto: CreateSetDto): Promise<SetType> => {
    const { data } = await apiClient.post<SetType>("/sets", dto);
    return data;
  },

  getSetById: async (id: string): Promise<SetType> => {
    const { data } = await apiClient.get<SetType>(`/sets/${id}`);
    return data;
  },

  updateSet: async (id: string, dto: UpdateSetDto): Promise<SetType> => {
    const { data } = await apiClient.put<SetType>(`/sets/${id}`, dto);
    return data;
  },

  deleteSet: async (id: string): Promise<void> => {
    await apiClient.delete(`/sets/${id}`);
  },

  getPublicSet: async (id: string): Promise<SetType> => {
    const { data } = await apiClient.get<SetType>(`/sets/${id}/public`);
    return data;
  },

  updatePublicSettings: async (
    id: string,
    settings: SetPublicSettings,
  ): Promise<SetPublicSettings> => {
    const { data } = await apiClient.put<SetPublicSettings>(
      `/sets/${id}/public-settings`,
      settings,
    );

    return data;
  },

  getPublicSettings: async (id: string): Promise<SetPublicSettings> => {
    const { data } = await apiClient.get<SetPublicSettings>(
      `/sets/${id}/public-settings`,
    );

    return data;
  },
};
