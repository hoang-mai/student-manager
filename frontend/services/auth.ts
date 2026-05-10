import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  LoginResponse,
  LoginRequest,
  ChangePasswordRequest,
  CreateUserRequest,
} from "@/types/auth";
import { UserDetailResponse } from "@/types/user";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
  },

  getProfile: async (): Promise<ApiResponse<UserDetailResponse>> => {
    return apiClient.get(ENDPOINTS.AUTH.PROFILE);
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  updateProfile: async (data: any) => {
    return apiClient.put(ENDPOINTS.AUTH.PROFILE, data);
  },

  register: async (data: CreateUserRequest) => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
  },
};
