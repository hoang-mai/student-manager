"use client";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { loginSchema } from "@/utils/validations/login";
import type { LoginFormValues } from "@/types/auth";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-[url('/img.png')] p-4 relative overflow-hidden bg-cover bg-center">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-secondary-500/30 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-tertiary-500/20 rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Login card */}
      <div className="w-full max-w-md animate-slide-up bg-white/60 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-xl shadow-neutral-200/50 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image src="/logo.png" alt="Logo" width={70} height={70} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Quản lý Học viên
          </h1>
          <p className="text-neutral-700 text-sm mt-1">
              Chào mừng bạn đến với hệ thống quản lý học viên - HVKHQS
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
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

          <div className="mt-2 flex items-center justify-center">
            <p className="text-neutral-900 text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Liên hệ với quản trị viên
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-neutral-700 text-xs">
              © 2026 Hệ thống Quản lý Học viên
            </p>
          </div>
        </div>
    </div>
  );
}
