"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ROLES, DEFAULT_VALUES } from "@/constants/constants";
import Avatar from "@/library/Avatar";
import {
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlineMoon,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import Dropdown from "@/library/Dropdown";

import Divide from "@/library/Divide";
import Toggle from "@/library/Toggle";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { THEMES } from "@/constants/constants";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { useModalStore } from "@/store/useModalStore";
import ChangePasswordForm from "@/components/student/layout/header/ChangePasswordForm";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { openModal } = useModalStore();

  const { data: profileResponse } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => authService.getProfile(),
  });

  const profile = profileResponse?.data;

  const isDarkMode = theme === THEMES.DARK;
  const handleToggleTheme = () => {
    const nextTheme = isDarkMode ? THEMES.LIGHT : THEMES.DARK;
    setTheme(nextTheme);
    Cookies.set("theme", nextTheme, { expires: 365 });
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const handleOpenChangePassword = () => {
    openModal({
      title: "Đổi mật khẩu",
      content: <ChangePasswordForm />,
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.CHANGE_PASSWORD,
      },
    });
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md flex items-center px-8 shrink-0 justify-between z-40 relative">
      <Divide className="absolute bottom-0 left-0 w-full" />
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-neutral-800 uppercase tracking-tighter">
          Cổng thông tin học viên
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
          Học viện Kỹ thuật Quân sự
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <Link
          href="/student/notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all border border-neutral-100 group"
        >
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
            <HiOutlineBell size={20} />
          </motion.div>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error-500 rounded-full border-2 border-white" />
        </Link>

        {/* User Profile & Dropdown */}
        <div className="flex items-center h-10 gap-6">
          <Divide orientation="vertical" className="h-6" />

          <Dropdown
            trigger={(isOpen) => (
              <div
                className={`flex items-center gap-3 transition-all group ${isOpen ? "opacity-80" : ""}`}
              >
                <div className="flex flex-col text-right">
                  <span className="text-sm font-bold text-neutral-800 leading-none group-hover:text-primary-700 transition-colors">
                    {profile?.profile?.fullName || DEFAULT_VALUES.DEFAULT_STUDENT_NAME}
                  </span>
                  <span className="text-[10px] tracking-widest text-neutral-400 font-black uppercase mt-1">
                    {ROLES.STUDENT.name}
                  </span>
                </div>
                <div className="relative">
                  <Avatar
                    src={profile?.profile?.avatar}
                    alt={profile?.profile?.fullName}
                    size={40}
                    className={`border-2 transition-all ${isOpen ? "border-primary-500 shadow-md" : "border-primary-50 shadow-sm"}`}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 text-neutral-500">
                    <HiOutlineChevronDown
                      size={10}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
              </div>
            )}
            dropdownClassName="w-64 bg-white rounded-3xl shadow-2xl shadow-neutral-900/10 border border-neutral-100 p-2 overflow-hidden"
          >
            <div className="space-y-1">
              {/* Thông tin cá nhân */}
              <Link href="/student/profile" className="block">
                <motion.button
                  whileHover="hover"
                  className="w-full flex items-center gap-3 p-2 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                    <motion.div
                      variants={{ hover: { scale: 1.2, rotate: 5 } }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <HiOutlineUser size={18} />
                    </motion.div>
                  </div>
                  Thông tin cá nhân
                </motion.button>
              </Link>

              {/* Đổi mật khẩu */}
              <motion.button
                whileHover="hover"
                onClick={handleOpenChangePassword}
                className="w-full flex items-center gap-3 p-2 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <motion.div
                    variants={{ hover: { y: -2, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineLockClosed size={18} />
                  </motion.div>
                </div>
                Đổi mật khẩu
              </motion.button>

              {/* Chế độ tối */}
              <motion.div
                whileHover="hover"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTheme();
                }}
                className="w-full flex items-center gap-3 p-2 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <motion.div
                    variants={{ hover: { rotate: -20, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineMoon size={18} />
                  </motion.div>
                </div>
                Chế độ tối
                <Toggle
                  checked={isDarkMode}
                  onChange={handleToggleTheme}
                  size="sm"
                  className="ml-auto"
                />
              </motion.div>
            </div>

            <div className="mt-2 pt-2 relative">
              <Divide className="absolute top-0 left-0 w-full" />
              <motion.button
                whileHover="hover"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-2 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-600 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-error-400 group-hover:bg-error-50 group-hover:text-error-600 transition-all">
                  <motion.div
                    variants={{ hover: { x: 3, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineLogout size={18} />
                  </motion.div>
                </div>
                Đăng xuất
              </motion.button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
