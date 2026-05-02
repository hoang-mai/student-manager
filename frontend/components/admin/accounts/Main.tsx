"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { userService } from "@/services/user";
import { UserQueryParams, CreateUserDTO } from "@/types/user";
import { User } from "@/types/auth";
import { ROLES } from "@/constants/constants";
import { formatDate } from "@/utils/fn-common";
import AnimatedContainer from "@/library/AnimatedContainer";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import Table from "@/library/Table";
import Select from "@/library/Select";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineDownload,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import UserFormModal from "@/components/commander/accounts/UserFormModal";
import { ENDPOINTS } from "@/constants/endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";

export default function Main() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  // State tìm kiếm và filter
  const [search, setSearch] = useState("");

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Cấu trúc cột cho Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "username",
        header: "Tài khoản",
        accessorKey: "username",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">
              {info.row.original.username}
            </span>
          </div>
        ),
      },
      {
        id: "role",
        header: "Vai trò",
        accessorKey: "role",
        cell: (info) => (
          <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs font-bold uppercase">
            {info.row.original.role}
          </span>
        ),
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        accessorKey: "createdAt",
        cell: (info) => (
          <span className="text-sm font-semibold text-gray-500 ">
            {formatDate(info.row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "updatedAt",
        header: "Ngày cập nhật",
        accessorKey: "updatedAt",
        cell: (info) => (
          <span className="text-sm font-semibold text-gray-500 ">
            {formatDate(info.row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center justify-start">
              <button
                onClick={() => handleOpenModal(user)}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                title="Chỉnh sửa"
              >
                <HiOutlinePencil size={18} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all"
                title="Khóa tài khoản"
              >
                <HiOutlineLockClosed size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Mutation: Tạo người dùng
  const createMutation = useMutation({
    mutationFn: (userData: CreateUserDTO) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      addToast({
        message: error.response?.data?.message || "Thêm thất bại!",
        variant: "error",
      });
    },
  });

  // Mutation: Cập nhật người dùng
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<CreateUserDTO>;
    }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Cập nhật thành công!", variant: "success" });
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      addToast({
        message: error.response?.data?.message || "Cập nhật thất bại!",
        variant: "error",
      });
    },
  });

  const handleOpenModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: CreateUserDTO) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <AnimatedContainer
      variant="slideUp"
      className="space-y-8 relative rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
        <HiOutlineHome size={14} className="mb-0.5" />
        <span>Trang chủ</span>
        <HiOutlineChevronRight size={12} />
        <span className="text-primary-600">Quản lý hệ thống tài khoản</span>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-neutral-800 tracking-tight uppercase">
            Quản lý hệ thống tài khoản
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => handleOpenModal()}
            className="h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary-600/20"
          >
            Thêm Tài khoản
          </Button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineDownload size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500 transition-colors">
            <HiOutlineRefresh size={18} className="rotate-90" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username hoặc email..."
            className="w-full h-11 pl-12 pr-4 bg-white border border-neutral-200 rounded-xl outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
          <Select
            value={ROLES.STUDENT.role}
            onChange={() => { }}
            options={[
              { value: ROLES.STUDENT.role, label: "Học viên" },
              { value: ROLES.COMMANDER.role, label: "Chỉ huy" },
              { value: ROLES.ADMIN.role, label: "Admin" },
            ]}
          />
        </div>

        <button
          onClick={() => {
            setSearch("");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
          }}
          className="h-11 px-4 flex items-center justify-center gap-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all text-sm font-bold"
        >
          <HiOutlineRefresh size={18} />
          <span className="hidden lg:inline text-[11px] font-black uppercase tracking-wider">
            Làm mới
          </span>
        </button>
      </div>

      <div className="bg-white overflow-hidden relative">
        {/* Table Area */}
        <div className="px-4">
          <Table
            fetchData={userService.getAllUsers}
            columns={columns}
            queryKey={[QUERY_KEYS.USERS]}
            additionalParams={{ search }}
            emptyText="Không tìm thấy tài khoản nào phù hợp"
          />
        </div>
      </div>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
      />
    </AnimatedContainer>
  );
}
