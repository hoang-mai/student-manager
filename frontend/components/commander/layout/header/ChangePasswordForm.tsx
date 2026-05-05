"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/utils/validations";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { authService } from "@/services/auth";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { ChangePasswordRequest } from "@/types/auth";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordRequest) => {
      showLoading();
      return authService.changePassword(data);
    },
    onSuccess: () => {
      addToast({
        message: "Đổi mật khẩu thành công!",
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      hideLoading();
      addToast({
        message: error?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại!",
        variant: "error",
      });
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
      <Input
        label="Mật khẩu cũ"
        type={showOldPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu hiện tại"
        isLoading={changePasswordMutation.isPending}
        prefixIcon={<HiOutlineLockClosed size={18} />}
        suffixIcon={
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? (
              <HiOutlineEyeOff size={18} />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </button>
        }
        error={errors.oldPassword?.message}
        {...register("oldPassword")}
        required={true}
      />

      <Input
        label="Mật khẩu mới"
        type={showNewPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu mới"
        isLoading={changePasswordMutation.isPending}
        required={true}
        prefixIcon={<HiOutlineLockClosed size={18} />}
        suffixIcon={
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <HiOutlineEyeOff size={18} />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </button>
        }
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />

      <Input
        label="Xác nhận mật khẩu mới"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Nhập lại mật khẩu mới"
        isLoading={changePasswordMutation.isPending}
        prefixIcon={<HiOutlineLockClosed size={18} />}
        suffixIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <HiOutlineEyeOff size={18} />
            ) : (
              <HiOutlineEye size={18} />
            )}
          </button>
        }
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        required={true}
      />

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          isLoading={changePasswordMutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          isLoading={changePasswordMutation.isPending}
          disabled={!isDirty}
        >
          Cập nhật mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
