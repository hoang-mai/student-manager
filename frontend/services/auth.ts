import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  LoginResponse,
  LoginRequest,
  ChangePasswordRequest,
} from "@/types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
  },


  getProfile: async () => {
    return apiClient.get(ENDPOINTS.AUTH.PROFILE);
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
