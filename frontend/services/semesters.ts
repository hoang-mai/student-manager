import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  CreateSemesterRequest,
  Semester,
  SemesterQueryRequest,
  UpdateSemesterRequest,
} from "@/types/semesters";

export const semesterService = {
  getSemesters: async (
    params?: SemesterQueryRequest
  ): Promise<PaginatedResponse<Semester>> => {
    return apiClient.get(ENDPOINTS.SEMESTERS.BASE, { params });
  },

  getSemester: async (id: string): Promise<Semester> => {
    return apiClient.get(`${ENDPOINTS.SEMESTERS.BASE}/${id}`);
  },

  createSemester: async (data: CreateSemesterRequest) => {
    return apiClient.post(ENDPOINTS.SEMESTERS.BASE, data);
  },

  updateSemester: async (id: string, data: UpdateSemesterRequest) => {
    return apiClient.put(`${ENDPOINTS.SEMESTERS.BASE}/${id}`, data);
  },

  deleteSemester: async (id: string) => {
    return apiClient.delete(`${ENDPOINTS.SEMESTERS.BASE}/${id}`);
  },
};
