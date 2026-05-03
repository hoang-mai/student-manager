"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/library/Button";
import Input from "@/library/Input";
import { ROLES } from "@/constants/constants";
import { User } from "@/types/auth";
import { CreateUserDTO } from "@/types/user";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userSchema, UserFormValues } from "@/utils/validations";

interface UpdateUserFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateUserDTO>) => {
      showLoading();
      return userService.updateUser(user.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Cập nhật thành công!", variant: "success" });
      onSuccess();
    },
    onError: (err: any) => {
      addToast({
        message: err.response?.data?.message || "Cập nhật thất bại!",
        variant: "error",
      });
    },
    onSettled: () => hideLoading(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    const roleEntry = Object.values(ROLES).find((r) => r.role === user.role);
    reset({
      username: user.username,
      email: user.email || "",
      full_name: user.fullName || "",
      role_id: roleEntry?.id || ROLES.STUDENT.id,
      password: "", // Not used in update
    });
  }, [user, reset]);

  const onSubmit = (data: UserFormValues) => {
    // Filter out password if it's empty
    const { password, ...updateData } = data;
    updateMutation.mutate(updateData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
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
          disabled={true}
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label="Email"
          placeholder="Ví dụ: a.nguyen@gmail.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5 ml-1">
            Vai trò
          </label>
          <select
            className={`w-full h-11 px-4 rounded-xl border ${
              errors.role_id
                ? "border-error-500 ring-1 ring-error-500"
                : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            } outline-none transition-all text-sm bg-white cursor-pointer`}
            {...register("role_id")}
          >
            <option value={ROLES.STUDENT.id}>Học viên (Student)</option>
            <option value={ROLES.COMMANDER.id}>Chỉ huy (Commander)</option>
            <option value={ROLES.ADMIN.id}>Quản trị viên (Admin)</option>
          </select>
          {errors.role_id && (
            <p className="mt-1 ml-1 text-xs text-error-500 font-medium">
              {errors.role_id.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          isLoading={updateMutation.isPending}
        >
          Cập nhật tài khoản
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
