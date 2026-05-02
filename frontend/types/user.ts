import { User } from "./auth";

/**
 * Tham số truy vấn cho danh sách người dùng
 */
export type UserQueryParams = {
  page?: number;
  limit?: number;
  username?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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
