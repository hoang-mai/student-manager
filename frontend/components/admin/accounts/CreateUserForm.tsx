"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/library/Button";
import Input from "@/library/Input";
import { ROLES } from "@/constants/constants";
import { CreateUserDTO } from "@/types/user";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userSchema, UserFormValues } from "@/utils/validations";
import Typography from "@/library/Typography";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const createMutation = useMutation({
    mutationFn: (userData: CreateUserDTO) => {
      showLoading();
      return userService.createUser(userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      onSuccess();
    },
    onError: (err) => {
      addToast({
        message: err.message || "Thêm thất bại!",
        variant: "error",
      });
    },
    onSettled: () => hideLoading(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      full_name: "",
      password: "",
      role_id: ROLES.STUDENT.id,
    },
  });

  const onSubmit = (data: UserFormValues) => {
    createMutation.mutate(data as CreateUserDTO);
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
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label="Email"
          placeholder="Ví dụ: a.nguyen@gmail.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          {...register("password")}
          error={errors.password?.message}
        />

        <div>
          <Typography
            as="label"
            variant="body"
            weight="semibold"
            color="neutral"
            className="block mb-1.5 ml-1"
          >
            Vai trò
          </Typography>
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
            <div className="mt-1 ml-1">
              <Typography variant="caption" weight="medium" color="error">
                {errors.role_id.message}
              </Typography>
            </div>
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
          isLoading={createMutation.isPending}
        >
          Tạo tài khoản
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
