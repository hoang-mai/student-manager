import api from "./axios";
import { User } from "@/types/auth";
import { 
  UserQueryParams, 
  PaginatedResponse, 
  CreateUserDTO 
} from "@/types/user";

export const userService = {
  /**
   * Lấy danh sách người dùng có phân trang và lọc
   */
  getAllUsers: async (params?: UserQueryParams) => {
    const response = await api.get<PaginatedResponse<User>>("/users", { params });
    return response.data;
  },

  /**
   * Lấy chi tiết một người dùng
   */
  getUserById: async (id: number) => {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data;
  },

  /**
   * Tạo người dùng mới
   */
  createUser: async (data: CreateUserDTO) => {
    const response = await api.post<{ data: User }>("/users", data);
    return response.data;
  },

  /**
   * Cập nhật thông tin người dùng
   */
  updateUser: async (id: number, data: Partial<CreateUserDTO>) => {
    const response = await api.put<{ data: User }>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Bật/Tắt trạng thái hoạt động của tài khoản
   */
  toggleActive: async (id: number) => {
    const response = await api.patch<{ data: User }>(`/users/${id}/toggle-active`);
    return response.data;
  },

  /**
   * Đặt lại mật khẩu cho người dùng
   */
  resetPassword: async (id: number, newPassword?: string) => {
    const response = await api.patch(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  },

  /**
   * Xóa người dùng (Chỉ Admin)
   */
  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
