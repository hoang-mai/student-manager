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
import Typography from "@/library/Typography";
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

  // Cấu trúc cột cho table
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
                <Typography variant="body" weight="black" transform="uppercase" className="leading-tight">
                  {user.username}
                </Typography>
                <Typography variant="label" weight="bold" color="gray" className="italic normal-case tracking-normal">
                  Mã HV: 202400{user.id}
                </Typography>
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
          <Typography variant="caption" weight="bold" color="neutral">Học viên</Typography>
        ),
      },
      {
        id: "unit",
        header: "Đơn vị",
        accessorKey: "unit",
        cell: () => (
          <Typography variant="caption" weight="bold" color="neutral">Đại đội 1</Typography>
        ),
      },
      {
        id: "position",
        header: "Chức vụ",
        accessorKey: "position",
        cell: () => (
          <Typography variant="caption" weight="bold" color="neutral">Lớp trưởng</Typography>
        ),
      },
      {
        id: "phone",
        header: "Số điện thoại",
        accessorKey: "phone",
        cell: () => (
          <Typography variant="caption" weight="bold" color="neutral" className="italic">
            0123.456.789
          </Typography>
        ),
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        accessorKey: "createdAt",
        cell: (info) => (
          <Typography variant="caption" weight="semibold" color="gray">
            {formatDate(info.row.original.createdAt)}
          </Typography>
        ),
      },
      {
        id: "updatedAt",
        header: "Ngày cập nhật",
        accessorKey: "updatedAt",
        cell: (info) => (
          <Typography variant="caption" weight="semibold" color="gray">
            {formatDate(info.row.original.updatedAt)}
          </Typography>
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
    mutationFn: (userData: CreateUserDTO) => authService.register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      setIsModalOpen(false);
    },
  });

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
      <div className="flex items-center gap-2 text-neutral-400">
        <HiOutlineHome size={14} className="mb-0.5" />
        <Typography variant="label">Trang chủ</Typography>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary">Danh sách học viên</Typography>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Typography variant="h1" transform="uppercase">
            Danh sách học viên - Năm học
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all">
            <HiOutlineRefresh size={16} className="text-neutral-600" />
            <Typography variant="label" color="neutral">Cập nhật học viên ra trường</Typography>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all">
            <HiOutlineOfficeBuilding size={16} className="text-neutral-600" />
            <Typography variant="label" color="neutral">Quản lý Trường</Typography>
          </button>

          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => handleOpenModal()}
            className="h-10 px-5 rounded-xl shadow-lg shadow-primary-600/20"
          >
            <Typography variant="label" color="white">Thêm Học viên</Typography>
          </Button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all">
            <HiOutlineDownload size={16} className="text-neutral-600" />
            <Typography variant="label" color="neutral">Xuất Excel QLCTNB</Typography>
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
