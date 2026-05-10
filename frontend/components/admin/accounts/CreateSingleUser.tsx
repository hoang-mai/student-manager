"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@/library/Button";
import Input from "@/library/Input";
import Select from "@/library/Select";
import { authService } from "@/services/auth";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CreateUserRequest } from "@/types/auth";
import { createUserSchema, CreateUserFormValues } from "@/utils/validations";

interface CreateSingleUserProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateSingleUser: React.FC<CreateSingleUserProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const createMutation = useMutation({
    mutationFn: (userData: CreateUserRequest) => {
      showLoading();
      return authService.register(userData);
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
    control,
    formState: { errors, isDirty },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: undefined,
      fullName: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Họ và tên"
            placeholder="Ví dụ: Nguyễn Văn A"
            {...register("fullName")}
            error={errors.fullName?.message}
            isLoading={createMutation.isPending}
            required={true}
          />
        </div>

        <Input
          label="Tên đăng nhập (Username)"
          placeholder="Ví dụ: nguyenvana"
          {...register("username")}
          error={errors.username?.message}
          isLoading={createMutation.isPending}
          required={true}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              label="Vai trò"
              options={[
                { value: "STUDENT", label: "Học viên" },
                { value: "COMMANDER", label: "Chỉ huy" },
                { value: "ADMIN", label: "Quản trị viên" },
              ]}
              error={errors.role?.message}
              value={field.value}
              onChange={field.onChange}
              isLoading={createMutation.isPending}
              required={true}
            />
          )}
        />

        <Input
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          {...register("password")}
          error={errors.password?.message}
          isLoading={createMutation.isPending}
          suffixIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          }
          required={true}
        />
        <Input
          label="Email"
          placeholder="Ví dụ: a.nguyen@gmail.com"
          {...register("email")}
          error={errors.email?.message}
          isLoading={createMutation.isPending}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 mt-6">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={createMutation.isPending}
          disabled={!isDirty}
        >
          Tạo tài khoản
        </Button>
      </div>
    </form>
  );
};

export default CreateSingleUser;
