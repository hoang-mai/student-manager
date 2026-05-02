"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { userService } from "@/services/user";
import { CreateUserDTO } from "@/types/user";
import { User } from "@/types/auth";
import { ROLES } from "@/constants/constants";
import { formatDate } from "@/utils/fn-common";
import AnimatedContainer from "@/library/AnimatedContainer";
import Button from "@/library/Button";
import Table from "@/library/Table";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineDownload,
  HiOutlineOfficeBuilding,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useToastStore } from "@/store/useToastStore";
import UserFormModal from "./UserFormModal";
import { QUERY_KEYS } from "@/constants/query-keys";

export default function Main() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  // State tìm kiếm và filter
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState(ROLES.STUDENT.role);
  const [date, setDate] = useState("");
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Cấu trúc cột cho Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "username",
        header: "Học viên",
        accessorKey: "username",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700 font-black overflow-hidden border border-white shadow-sm shrink-0">
                {(user.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-neutral-800 uppercase tracking-tight leading-tight">
                  {user.username}
                </span>
                <span className="text-[11px] font-bold text-neutral-400 italic">
                  Mã HV: 202400{user.id}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "rank",
        header: "Cấp bậc",
        accessorKey: "rank",
        cell: () => (
          <span className="text-xs font-bold text-neutral-500">Học viên</span>
        ),
      },
      {
        id: "unit",
        header: "Đơn vị",
        accessorKey: "unit",
        cell: () => (
          <span className="text-xs font-bold text-neutral-500">Đại đội 1</span>
        ),
      },
      {
        id: "position",
        header: "Chức vụ",
        accessorKey: "position",
        cell: () => (
          <span className="text-xs font-bold text-neutral-500">Lớp trưởng</span>
        ),
      },
      {
        id: "phone",
        header: "Số điện thoại",
        accessorKey: "phone",
        cell: () => (
          <span className="text-xs font-bold text-neutral-500 italic">
            0123.456.789
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
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleOpenModal(user)}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <HiOutlinePencil size={18} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all">
                <HiOutlineLockClosed size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: (userData: CreateUserDTO) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<CreateUserDTO> }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Cập nhật thành công!", variant: "success" });
      setIsModalOpen(false);
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
        <span className="text-primary-600">Danh sách học viên</span>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-neutral-800 tracking-tight uppercase">
            Danh sách học viên - Năm học
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineRefresh size={16} />
            Cập nhật học viên ra trường
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineOfficeBuilding size={16} />
            Quản lý Trường
          </button>

          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => handleOpenModal()}
            className="h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary-600/20"
          >
            Thêm Học viên
          </Button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineDownload size={16} />
            Xuất Excel QLCTNB
          </button>
        </div>
      </div>

      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <Table
            fetchData={userService.getAllUsers}
            columns={columns}
            queryKey={[QUERY_KEYS.USERS]}
            additionalParams={{
              search: isFilterEnabled ? search : "",
              role: isFilterEnabled ? filterRole : "",
              date: isFilterEnabled ? date : "",
            }}
            filterFields={[
              {
                type: "text",
                key: "search",
                label: "Tìm kiếm",
                placeholder: "Tên hoặc mã học viên...",
              },
              {
                type: "select",
                key: "role",
                label: "Vai trò",
                options: [
                  { value: "", label: "Tất cả vai trò" },
                  { value: ROLES.STUDENT.role, label: "Học viên" },
                  { value: ROLES.COMMANDER.role, label: "Chỉ huy" },
                  { value: ROLES.ADMIN.role, label: "Admin" },
                ],
              },
              {
                type: "date",
                key: "date",
                label: "Ngày nhập ngũ",
              },
            ]}
            onSearch={(values) => {
              setSearch(values.search || "");
              setFilterRole(values.role || "");
              setDate(values.date || "");
              setIsFilterEnabled(true);
            }}
            onReset={() => {
              setSearch("");
              setFilterRole(ROLES.STUDENT.role);
              setDate("");
              setIsFilterEnabled(true);
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
            }}
            emptyText="Không tìm thấy học viên nào phù hợp"
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
