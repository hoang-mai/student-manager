import apiClient from "./axios-client";
import { LoginFormValues, LoginResponse } from "@/types/auth";
import { ENDPOINTS } from "@/constants/endpoints";

export const authService = {
  login: async (data: LoginFormValues): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
  },

  logout: async () => {
    return apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return apiClient.get(ENDPOINTS.AUTH.PROFILE);
  },
};
