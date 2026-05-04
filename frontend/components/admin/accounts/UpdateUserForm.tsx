"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/library/Button";
import Input from "@/library/Input";
import { UserDetailResponse, UpdateUserRequest } from "@/types/user";
import { ROLES } from "@/constants/constants";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { updateUserSchema, UpdateUserFormValues } from "@/utils/validations";

interface UpdateUserFormProps {
  user: UserDetailResponse;
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
    mutationFn: (data: UpdateUserRequest) => {
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
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user.student?.email || user.commander?.email || "",
      fullName: user.student?.fullName || user.commander?.fullName || "",
    }
  });


  const onSubmit = (data: UpdateUserFormValues) => {
    updateMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Họ và tên"
          placeholder="Ví dụ: Nguyễn Văn A"
          {...register("fullName")}
          error={errors.fullName?.message}
          isLoading={updateMutation.isPending}
        />
        <Input
          label="Email"
          placeholder="Ví dụ: a.nguyen@gmail.com"
          {...register("email")}
          error={errors.email?.message}
          isLoading={updateMutation.isPending}
        />
        <Input
          label="Tên đăng nhập (Username)"
          value={user.username}
          disabled={true}
          readOnly={true}
        />

        <Input
          label="Vai trò"
          value={ROLES[user.role as keyof typeof ROLES]?.name || user.role}
          disabled={true}
          readOnly={true}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          isLoading={updateMutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={updateMutation.isPending}
          disabled={!isDirty}
        >
          Cập nhật hồ sơ
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
