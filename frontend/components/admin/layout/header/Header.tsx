"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ROLES } from "@/constants/constants";
import Avatar from "@/library/Avatar";
import {
  HiOutlineLogout,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineLockClosed,
  HiOutlineMoon,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import Dropdown from "@/library/Dropdown";

import Divide from "@/library/Divide";
import Toggle from "@/library/Toggle";
import { useTheme } from "next-themes";
import Cookies from "js-cookie";
import { THEMES } from "@/constants/constants";
import { useModalStore } from "@/store/useModalStore";
import ChangePasswordForm from "@/components/admin/layout/header/ChangePasswordForm";
import Typography from "@/library/Typography";
import { MUTATION_KEYS } from "@/constants/query-keys";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { openModal } = useModalStore();

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
        <Typography variant="h2" transform="uppercase">
          Hệ thống quản lý học viên
        </Typography>
        <Typography
          variant="label"
          color="gray"
          tracking="widest"
          className="leading-none mt-0.5"
        >
          Chào mừng đến với hệ thống quản lý học viên
        </Typography>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative size-10 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 transition-all border border-neutral-100 group">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }}>
            <HiOutlineBell size={20} />
          </motion.div>
          <span className="absolute top-2.5 right-2.5 size-2 bg-error-500 rounded-full border-2 border-white" />
        </button>

        {/* User Profile & Dropdown */}
        <div className="flex items-center h-10 gap-6">
          <Divide orientation="vertical" className="h-6" />

          <Dropdown
            trigger={(isOpen) => (
              <div
                className={`flex items-center gap-3 transition-all group ${isOpen ? "opacity-80" : ""}`}
              >
                <div className="flex flex-col text-right">
                  <Typography
                    variant="body"
                    weight="bold"
                    color="neutral"
                    className="leading-none group-hover:text-primary-700 transition-colors"
                  >
                    Quản trị hệ thống
                  </Typography>
                  <Typography
                    variant="label"
                    weight="black"
                    color="gray"
                    className="mt-1"
                  >
                    {ROLES.ADMIN.name}
                  </Typography>
                </div>
                <div className="relative">
                  <Avatar
                    src={undefined}
                    alt="Quản trị hệ thống"
                    size={40}
                    className={`border-2 transition-all ${isOpen ? "border-primary-500 shadow-md" : "border-primary-50 shadow-sm"}`}
                  />
                  <div className="absolute -bottom-1 -right-1 size-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-neutral-100 text-neutral-500">
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
              {/* Đổi mật khẩu */}
              <motion.button
                whileHover="hover"
                onClick={handleOpenChangePassword}
                className="w-full flex items-center gap-3 p-2 rounded-2xl text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-primary-600 transition-all text-left group cursor-pointer"
              >
                <div className="size-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <motion.div
                    variants={{ hover: { y: -2, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineLockClosed size={18} />
                  </motion.div>
                </div>
                <Typography variant="body" weight="semibold">
                  Đổi mật khẩu
                </Typography>
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
                <div className="size-8 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                  <motion.div
                    variants={{ hover: { rotate: -20, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineMoon size={18} />
                  </motion.div>
                </div>
                <Typography variant="body" weight="semibold">
                  Chế độ tối
                </Typography>
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
                <div className="size-8 rounded-xl bg-neutral-50 flex items-center justify-center text-error-400 group-hover:bg-error-50 group-hover:text-error-600 transition-all">
                  <motion.div
                    variants={{ hover: { x: 3, scale: 1.1 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <HiOutlineLogout size={18} />
                  </motion.div>
                </div>
                <Typography variant="body" weight="semibold">
                  Đăng xuất
                </Typography>
              </motion.button>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
