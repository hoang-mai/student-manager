import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  Class,
  ClassQueryRequest,
  CreateClassRequest,
  UpdateClassRequest,
} from "@/types/classes";

export const classService = {
  getClasses: async (
    params?: ClassQueryRequest
  ): Promise<PaginatedResponse<Class>> => {
    return apiClient.get(ENDPOINTS.CLASSES.BASE, { params });
  },

  createClass: async (
    data: CreateClassRequest
  ) => {
    return apiClient.post(ENDPOINTS.CLASSES.BASE, data);
  },

  updateClass: async (
    id: string,
    data: UpdateClassRequest
  ) => {
    return apiClient.put(`${ENDPOINTS.CLASSES.BASE}/${id}`, data);
  },

  deleteClass: async (id: string) => {
    return apiClient.delete(`${ENDPOINTS.CLASSES.BASE}/${id}`);
  },
};
