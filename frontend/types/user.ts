import { User } from "./auth";

/**
 * Tham số truy vấn cho danh sách người dùng
 */
export type UserQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  orderColumn?: string;
  orderDirection?: "asc" | "desc";
};

/**
 * DTO cho việc tạo mới hoặc cập nhật người dùng
 */
export type CreateUserDTO = {
  username: string;
  email: string;
  password?: string;
  full_name: string;
  role_id: number;
};
