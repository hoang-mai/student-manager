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
import Badge, { BadgeVariant } from "@/library/Badge";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineDownload,
  HiOutlineTrash,
} from "react-icons/hi";
import { useToastStore } from "@/store/useToastStore";
import UserFormModal from "@/components/commander/accounts/UserFormModal";
import Tooltip from "@/library/Tooltip";
import { FilterField } from "@/library/table/TableFilter";
import { useConfirmStore } from "@/store/useConfirmStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function Main() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { openConfirm, closeConfirm, setLoading } = useConfirmStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string | number) => {
      setLoading(true);
      showLoading();
      return userService.toggleActive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Cập nhật trạng thái thành công!", variant: "success" });
      closeConfirm();
    },
    onError: (err) => {
      addToast({
        message: err.message || "Cập nhật trạng thái thất bại!",
        variant: "error",
      });
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => {
      setLoading(true);
      showLoading();
      return userService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Xóa tài khoản thành công!", variant: "success" });
      closeConfirm();
    },
    onError: (err) => {
      addToast({
        message: err.message || "Xóa tài khoản thất bại!",
        variant: "error",
      });
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
  });

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
        cell: (info) => {
          const role = info.row.original.role;
          const variantMap: Record<string, BadgeVariant> = {
            ADMIN: "primary",
            COMMANDER: "secondary",
            STUDENT: "neutral",
          };
          return (
            <Badge variant={variantMap[role] || "neutral"}>
              {ROLES[role].name}
            </Badge>
          );
        },
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
            <div className="flex items-center justify-start gap-1">
              <Tooltip content="Chỉnh sửa tài khoản" position="top">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                >
                  <HiOutlinePencil size={18} />
                </button>
              </Tooltip>

              <Tooltip content={!user.deleteAt ? "Khóa tài khoản" : "Mở khóa tài khoản"} position="top">
                <button
                  onClick={() => openConfirm({
                    title: user.deleteAt ? "Mở khóa tài khoản" : "Xác nhận khóa",
                    message: `Bạn có chắc chắn muốn ${user.deleteAt ? "mở khóa" : "tạm khóa"} tài khoản "${user.username}" không?`,
                    confirmText: user.deleteAt ? "Mở khóa" : "Khóa tài khoản",
                    variant: user.deleteAt ? "primary" : "danger",
                    onConfirm: () => {
                      toggleActiveMutation.mutate(user.id);
                    },
                  })}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all"
                >
                  <HiOutlineLockClosed size={18} />
                </button>
              </Tooltip>

              <Tooltip content="Xóa tài khoản" position="top">
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Xác nhận xóa",
                      message: `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${user.username}" không? Hành động này không thể hoàn tác.`,
                      confirmText: "Xóa ngay",
                      variant: "danger",
                      onConfirm: () => deleteMutation.mutate(user.id),
                    })
                  }
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-all"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [openConfirm, toggleActiveMutation, deleteMutation]
  );

  const filterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "username",
        label: "Tên đăng nhập",
        placeholder: "Nhập tên đăng nhập...",
      },
      {
        type: "select",
        id: "role",
        label: "Vai trò",
        options: [
          { value: "", label: "Tất cả vai trò" },
          { value: ROLES.STUDENT.role, label: ROLES.STUDENT.name },
          { value: ROLES.COMMANDER.role, label: ROLES.COMMANDER.name },
          { value: ROLES.ADMIN.role, label: ROLES.ADMIN.name },
        ],
        placeholder: "Chọn vai trò...",
      },
    ],
    []
  );

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

      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <Table
            fetchData={userService.getAllUsers}
            columns={columns}
            queryKey={[QUERY_KEYS.USERS]}
            filterFields={filterOptions}
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
