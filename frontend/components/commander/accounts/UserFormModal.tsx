"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/library/Button";
import Input from "@/library/Input";
import { ROLES } from "@/constants/constants";
import { User } from "@/types/auth";
import { CreateUserDTO } from "@/types/user";

const userSchema = z.object({
  username: z.string().min(3, "Username phải ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  full_name: z.string().min(1, "Họ và tên không được để trống"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự").optional().or(z.literal("")),
  role_id: z.coerce.number(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDTO) => void;
  user?: User | null;
  isLoading?: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user, 
  isLoading 
}) => {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
      role_id: ROLES.STUDENT.id, // Mặc định là Student
    },
  });

  useEffect(() => {
    if (user) {
      // Tìm role_id dựa trên string role từ backend (ví dụ: "COMMANDER" -> 2)
      const roleEntry = Object.values(ROLES).find(r => r.role === user.role);
      
      reset({
        username: user.username,
        email: user.email || "",
        full_name: user.fullName || "",
        role_id: roleEntry?.id || ROLES.STUDENT.id,
        password: "", // Không hiển thị mật khẩu khi edit
      });
    } else {
      reset({
        username: "",
        email: "",
        full_name: "",
        role_id: ROLES.STUDENT.id,
        password: "",
      });
    }
  }, [user, reset]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h3 className="text-xl font-bold text-neutral-800">
              {isEdit ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500"
            >
              <HiOutlineX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Họ và tên"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...register("full_name")}
                  error={errors.full_name?.message}
                />
              </div>

              <Input
                label="Tên đăng nhập (Username)"
                placeholder="Ví dụ: nguyenvana"
                disabled={isEdit} // Không cho sửa username
                {...register("username")}
                error={errors.username?.message}
              />

              <Input
                label="Email"
                placeholder="Ví dụ: a.nguyen@gmail.com"
                {...register("email")}
                error={errors.email?.message}
              />

              {!isEdit && (
                <Input
                  label="Mật khẩu"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...register("password")}
                  error={errors.password?.message}
                />
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5 ml-1">
                  Vai trò
                </label>
                <select 
                  className={`w-full h-11 px-4 rounded-xl border ${
                    errors.role_id ? 'border-error-500 ring-1 ring-error-500' : 'border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } outline-none transition-all text-sm bg-white`}
                  {...register("role_id")}
                >
                  <option value={ROLES.STUDENT.id}>Học viên (Student)</option>
                  <option value={ROLES.COMMANDER.id}>Chỉ huy (Commander)</option>
                  <option value={ROLES.ADMIN.id}>Quản trị viên (Admin)</option>
                </select>
                {errors.role_id && (
                  <p className="mt-1 ml-1 text-xs text-error-500 font-medium">{errors.role_id.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
              <Button variant="ghost" type="button" onClick={onClose}>
                Hủy bỏ
              </Button>
              <Button variant="primary" type="submit" isLoading={isLoading}>
                {isEdit ? "Cập nhật" : "Tạo tài khoản"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserFormModal;
