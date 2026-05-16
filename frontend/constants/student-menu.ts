import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineClipboardCheck,
  HiOutlineClipboardList,
  HiOutlineHome,
  HiOutlineIdentification,
  HiOutlineSparkles,
} from "react-icons/hi";

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

export const STUDENT_MENU = [
  {
    title: "Tổng quan",
    path: "/student",
    icon: HiOutlineHome,
  },
  {
    title: "Thông tin cá nhân",
    path: "/student/profile",
    icon: HiOutlineIdentification,
  },
  {
    title: "Kết quả học tập",
    path: "/student/results",
    icon: HiOutlineAcademicCap,
  },
  {
    title: "Quản lý lịch học",
    path: "/student/time-table",
    icon: HiOutlineCalendar,
  },
  {
    title: "Lịch cắt cơm",
    path: "/student/meal-schedules",
    icon: HiOutlineCalendar,
  },
  {
    title: "Thành tích & học phí",
    path: "/student/achievements-tuition",
    icon: HiOutlineCash,
  },
  {
    title: "Thông báo",
    path: "/student/notifications",
    icon: HiOutlineBell,
  },
  {
    title: "Tiện ích hỗ trợ",
    path: "/student/utilities",
    icon: HiOutlineSparkles,
  },
] as const satisfies readonly MenuItem[];
