"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { loginSchema } from "@/utils/validations/login";
import type { LoginFormValues } from "@/types/auth";

export default function Main() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // TODO: Gọi API login
      console.log("Login data:", data);
    } catch {
      console.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-900/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-secondary-900/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-tertiary-900/20 rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Login card */}
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-xl shadow-neutral-200/50 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-4">
              <svg
                className="w-7 h-7 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Quản lý Học viên
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Đăng nhập để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="login-username"
              label="Tên đăng nhập"
              placeholder="Nhập tên đăng nhập"
              size="lg"
              prefixIcon={<FiUser size={18} />}
              error={errors.username?.message}
              {...register("username")}
            />

            <Input
              id="login-password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              size="lg"
              prefixIcon={<FiLock size={18} />}
              suffixIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500/20 accent-primary-600"
                  {...register("remember")}
                />
                <span className="text-sm text-neutral-600">Ghi nhớ</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              fullWidth
              loading={isSubmitting}
              id="login-submit"
            >
              Đăng nhập
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-neutral-400 text-xs">
              © 2026 Hệ thống Quản lý Học viên
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
