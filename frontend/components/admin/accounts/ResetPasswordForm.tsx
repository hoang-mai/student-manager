"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/utils/validations";
import { User } from "@/types/auth";

interface ResetPasswordFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  user,
  onSuccess,
  onCancel,
}) => {
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) => {
      showLoading();
      return userService.resetPassword(user.id, password);
    },
    onSuccess: () => {
      addToast({
        message: `Đặt lại mật khẩu cho "${user.username}" thành công!`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (error) => {
      addToast({
        message: error?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại!",
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
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(data.newPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">

      <p className="text-sm font-bold text-neutral-800">
        Tài khoản: <span className="text-primary-500">{user.username}</span>
      </p>

      <Input
        label="Mật khẩu mới"
        type={showNewPassword ? "text" : "password"}
        placeholder="Nhập mật khẩu mới"
        isLoading={resetPasswordMutation.isPending}
        prefixIcon={<HiOutlineLockClosed size={18} />}
        suffixIcon={
          <button
            type="button"
            className="cursor-pointer text-neutral-400 hover:text-primary-500 transition-colors"
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
        isLoading={resetPasswordMutation.isPending}
        prefixIcon={<HiOutlineLockClosed size={18} />}
        suffixIcon={
          <button
            type="button"
            className="cursor-pointer text-neutral-400 hover:text-primary-500 transition-colors"
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
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={resetPasswordMutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          isLoading={resetPasswordMutation.isPending}
          className="bg-amber-500 hover:bg-amber-600 border-amber-500 hover:border-amber-600"
        >
          Đặt lại mật khẩu
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
