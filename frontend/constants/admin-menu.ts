import React from 'react';
import {
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineHome,
  HiOutlineShieldCheck
} from 'react-icons/hi';

export type MenuItem = {
  title: string;
  path: string;
  icon: React.ElementType;
  code: string;
};

export const ADMIN_MENU: MenuItem[] = [
  {
    title: 'Tổng quan',
    path: '/admin',
    icon: HiOutlineHome,
    code: 'ADMIN-DASHBOARD',
  },
  {
    title: 'Quản lý tài khoản',
    path: '/admin/accounts',
    icon: HiOutlineUserGroup,
    code: 'ADMIN-01',
  },
  {
    title: 'Quản lý phân quyền',
    path: '/admin/roles',
    icon: HiOutlineShieldCheck,
    code: 'ADMIN-02',
  },
  {
    title: 'Quản lý hệ thống',
    path: '/admin/settings',
    icon: HiOutlineViewGrid,
    code: 'ADMIN-03',
  },
];
