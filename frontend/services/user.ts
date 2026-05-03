import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import { User } from "@/types/auth";
import { 
  UserQueryParams, 
  CreateUserDTO 
} from "@/types/user";

export const userService = {

  getAllUsers: async (params: UserQueryParams): Promise<PaginatedResponse<User>> => {
    return apiClient.get(ENDPOINTS.USERS.BASE, { params });
  },
  
  getUserById: async (id: string | number): Promise<ApiResponse<User>> => {
    return apiClient.get(ENDPOINTS.USERS.DETAIL(id));
  },
  
  createUser: async (data: CreateUserDTO): Promise<ApiResponse<User>> => {
    return apiClient.post(ENDPOINTS.USERS.BASE, data);
  },

  updateUser: async (id: string | number, data: Partial<CreateUserDTO>): Promise<ApiResponse<User>> => {
    return apiClient.put(ENDPOINTS.USERS.DETAIL(id), data);
  },
  
  toggleActive: async (id: string | number) => {
    return apiClient.post(ENDPOINTS.USERS.TOGGLE_ACTIVE(id));
  },

  resetPassword: async (id: string | number, newPassword?: string) => {
    return apiClient.patch(ENDPOINTS.USERS.RESET_PASSWORD(id), { newPassword });
  },

  deleteUser: async (id: string | number) => {
    return apiClient.delete(ENDPOINTS.USERS.DETAIL(id));
  }
};
