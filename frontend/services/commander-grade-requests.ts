import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  GradeRequest,
  GradeRequestQueryRequest,
  ReviewGradeRequestRequest,
} from "@/types/student-academic";

export const commanderGradeRequestService = {
  getGradeRequests: async (
    params?: GradeRequestQueryRequest
  ): Promise<PaginatedResponse<GradeRequest>> => {
    return apiClient.get(ENDPOINTS.COMMANDERS.GRADE_REQUESTS, { params });
  },

  getGradeRequestDetail: async (id: string): Promise<ApiResponse<GradeRequest>> => {
    return apiClient.get(ENDPOINTS.COMMANDERS.GRADE_REQUEST_DETAIL(id));
  },

  approveGradeRequest: async (
    id: string,
    data: ReviewGradeRequestRequest
  ): Promise<ApiResponse<GradeRequest>> => {
    return apiClient.post(ENDPOINTS.COMMANDERS.APPROVE_GRADE_REQUEST(id), data);
  },

  rejectGradeRequest: async (
    id: string,
    data: ReviewGradeRequestRequest
  ): Promise<ApiResponse<GradeRequest>> => {
    return apiClient.post(ENDPOINTS.COMMANDERS.REJECT_GRADE_REQUEST(id), data);
  },
};
