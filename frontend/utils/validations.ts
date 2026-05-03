import { z } from "zod";

/**
 * Schema validation cho form đăng nhập
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập tên đăng nhập")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Schema validation cho form đổi mật khẩu
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/**
 * Schema validation cho form đặt lại mật khẩu (Admin)
 */
export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Mật khẩu mới phải ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * Schema validation cho form thêm/sửa tài khoản (Admin)
 */
export const userSchema = z.object({
  username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  full_name: z.string().min(1, "Họ và tên không được để trống"),
  password: z
    .string()
    .min(6, "Mật khẩu phải ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
  role_id: z.coerce.number(),
});

export type UserFormValues = z.infer<typeof userSchema>;

