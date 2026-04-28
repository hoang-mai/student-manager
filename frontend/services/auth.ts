import api from './axios';
import { LoginFormValues, LoginResponse } from '@/types/auth';
import { ENDPOINTS } from '@/constants/endpoints';

export const authService = {
  login: async (data: LoginFormValues): Promise<LoginResponse> => {
    return api.post(ENDPOINTS.AUTH.LOGIN, data);
  },

  logout: async () => {
    return api.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return api.get(ENDPOINTS.AUTH.PROFILE);
  }
};
