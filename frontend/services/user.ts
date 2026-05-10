import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import { CreateUserRequest } from "@/types/auth";
import {
  User,
  UserQueryRequest,
  UserDetailResponse,
  UpdateProfileRequest,
} from "@/types/user";

export const userService = {
  getAllUsers: async (
    params: UserQueryRequest
  ): Promise<PaginatedResponse<UserDetailResponse>> => {
    return apiClient.get(ENDPOINTS.USERS.BASE, { params });
  },

  getUserById: async (
    id: string | number
  ): Promise<ApiResponse<UserDetailResponse>> => {
    return apiClient.get(ENDPOINTS.USERS.DETAIL(id));
  },

  updateUser: async (
    id: string | number,
    data: UpdateProfileRequest
  ) => {
    return apiClient.put(ENDPOINTS.USERS.DETAIL(id), data);
  },

  toggleActive: async (id: string | number) => {
    return apiClient.post(ENDPOINTS.USERS.TOGGLE_ACTIVE(id));
  },

  resetPassword: async (id: string | number, newPassword?: string) => {
    return apiClient.post(ENDPOINTS.USERS.RESET_PASSWORD(id), { newPassword });
  },

  deleteUser: async (id: string | number) => {
    return apiClient.delete(ENDPOINTS.USERS.DETAIL(id));
  },

  createBatchUsers: async (data: CreateUserRequest[]) => {
    return apiClient.post(ENDPOINTS.USERS.BATCH, { users: data });
  },

  updateBatchStudents: async (data: UpdateProfileRequest[]) => {
    return apiClient.put(ENDPOINTS.USERS.BATCH_PROFILES, data);
  },
};
