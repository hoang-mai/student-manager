import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  AcademicResultQueryRequest,
  CreateGradeRequestRequest,
  GradeRequest,
  GradeRequestQueryRequest,
  YearlyResult,
} from "@/types/student-academic";

const toPaginatedResponse = <T>(items: T[]): PaginatedResponse<T> => ({
  statusCode: 200,
  message: "Thành công",
  data: items,
  pagination: {
    total: items.length,
    page: 1,
    limit: Math.max(items.length, 1),
    totalPages: 1,
  },
});

export const studentAcademicService = {
  getAcademicResults: async (params?: AcademicResultQueryRequest): Promise<PaginatedResponse<YearlyResult>> => {
    const response = await apiClient.get<ApiResponse<YearlyResult[]>, ApiResponse<YearlyResult[]>>(
      ENDPOINTS.STUDENTS.ACADEMIC_RESULTS,
      { params }
    );

    return toPaginatedResponse(response.data || []);
  },

  getGradeRequests: async (params?: GradeRequestQueryRequest): Promise<PaginatedResponse<GradeRequest>> => {
    const response = await apiClient.get<ApiResponse<GradeRequest[]>, ApiResponse<GradeRequest[]>>(
      ENDPOINTS.STUDENTS.GRADE_REQUESTS,
      { params }
    );

    return toPaginatedResponse(response.data || []);
  },

  createGradeRequest: async (data: CreateGradeRequestRequest) => {
    return apiClient.post<ApiResponse<GradeRequest>>(ENDPOINTS.STUDENTS.GRADE_REQUESTS, data);
  },
};
