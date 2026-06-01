import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  AssignStudentsBatchRequest,
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

  assignStudentsBatch: async (
    id: string,
    data: AssignStudentsBatchRequest
  ): Promise<ApiResponse<BatchMutationResult>> => {
    return apiClient.post(ENDPOINTS.CLASSES.ASSIGN_STUDENTS_BATCH(id), data);
  },
};
