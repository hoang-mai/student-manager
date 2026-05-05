import React from 'react';
import { 
  HiOutlineUserGroup, 
  HiOutlineOfficeBuilding, 
  HiOutlineIdentification, 
  HiOutlineCheckCircle, 
  HiOutlineStop, 
  HiOutlineCalendar, 
  HiOutlineCash, 
  HiOutlineAcademicCap, 
  HiOutlineChartBar, 
  HiOutlineClipboardList, 
  HiOutlineViewGrid,
  HiOutlineHome
} from 'react-icons/hi';

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

export const COMMANDER_MENU: MenuItem[] = [
  {
    title: 'Tổng quan',
    path: '/commander',
    icon: HiOutlineHome,
  },
  {
    title: 'Tài khoản học viên',
    path: '/commander/accounts',
    icon: HiOutlineUserGroup,
  },
  {
    title: 'Cơ sở đào tạo',
    path: '/commander/training-units',
    icon: HiOutlineOfficeBuilding,
  },
  {
    title: 'Hồ sơ học viên',
    path: '/commander/profiles',
    icon: HiOutlineIdentification,
  },
  {
    title: 'Phê duyệt đề xuất',
    path: '/commander/approvals',
    icon: HiOutlineCheckCircle,
  },
  {
    title: 'Quản lý thành tích',
    path: '/commander/achievements',
    icon: HiOutlineStop,
  },
  {
    title: 'Lịch học & Cắt cơm',
    path: '/commander/schedules',
    icon: HiOutlineCalendar,
  },
  {
    title: 'Quản lý học phí',
    path: '/commander/tuition',
    icon: HiOutlineCash,
  },
  {
    title: 'Quản lý học kỳ',
    path: '/commander/semesters',
    icon: HiOutlineAcademicCap,
  },
  {
    title: 'Thống kê & Báo cáo',
    path: '/commander/statistics',
    icon: HiOutlineChartBar,
  },
  {
    title: 'Phân công lịch trực',
    path: '/commander/duty-roster',
    icon: HiOutlineClipboardList,
  },
  {
    title: 'Tiện ích hỗ trợ',
    path: '/commander/utilities',
    icon: HiOutlineViewGrid,
  },
];
