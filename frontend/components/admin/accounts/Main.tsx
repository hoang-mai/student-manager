"use client";

import { useMemo, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { userService } from "@/services/user";
import { UserDetailResponse } from "@/types/user";
import { ROLES } from "@/constants/constants";
import { formatDate } from "@/utils/fn-common";
import AnimatedContainer from "@/library/AnimatedContainer";
import Table from "@/library/Table";
import Badge, { BadgeVariant } from "@/library/Badge";
import {
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineEye,
} from "react-icons/hi";
import { useToastStore } from "@/store/useToastStore";
import Tooltip from "@/library/Tooltip";
import Typography from "@/library/Typography";
import { FilterField } from "@/library/table/TableFilter";
import { useConfirmStore } from "@/store/useConfirmStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useModalStore } from "@/store/useModalStore";
import ResetPasswordForm from "./ResetPasswordForm";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DetailUserForm from "./DetailUserForm";

export default function Main() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { openConfirm, closeConfirm, setLoading } = useConfirmStore();
  const { openModal, closeModal } = useModalStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string | number) => {
      setLoading(true);
      showLoading();
      return userService.toggleActive(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({
        message: "Cập nhật trạng thái thành công!",
        variant: "success",
      });
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

  const handleOpenCreateModal = useCallback(() => {
    openModal({
      title: "Thêm tài khoản mới",
      content: <CreateUserForm onSuccess={closeModal} onCancel={closeModal} />,
      size: "md",
    });
  }, [openModal, closeModal]);

  const handleOpenUpdateModal = useCallback(
    (user: UserDetailResponse) => {
      openModal({
        title: "Chỉnh sửa tài khoản",
        content: (
          <UpdateUserForm
            user={user}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        ),
        size: "md",
      });
    },
    [openModal, closeModal]
  );

  const handleOpenDetailModal = useCallback(
    (user: UserDetailResponse) => {
      openModal({
        title: "Chi tiết tài khoản",
        content: <DetailUserForm userId={user.id} initialData={user} />,
        size: "xl",
      });
    },
    [openModal]
  );

  const columns = useMemo<ColumnDef<UserDetailResponse>[]>(
    () => [
      {
        id: "username",
        header: "Tài khoản",
        accessorKey: "username",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <Typography variant="body" weight="semibold" color="neutral">
              {info.row.original.username}
            </Typography>
          </div>
        ),
      },
      {
        id: "info",
        header: "Thông tin cá nhân",
        cell: (info) => {
          const { fullName, email } = info.row.original.commander || info.row.original.student || {};
          return (
            <div className="flex flex-col gap-0.5">
              <Typography variant="body" weight="semibold" color="neutral">
                {fullName || "Chưa cập nhật"}
              </Typography>
              <Typography variant="caption" color="gray">
                {email || "Không có email"}
              </Typography>
            </div>
          );
        },
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
        id: "isActive",
        header: "Trạng thái",
        accessorKey: "isActive",
        cell: (info) => {
          const isActive = info.row.original.isActive;
          return (
            <Badge variant={isActive ? "success" : "error"}>
              {isActive ? "Đang hoạt động" : "Đã khóa"}
            </Badge>
          );
        },
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
            <div className="flex items-center justify-start">
              <Tooltip content="Xem chi tiết" position="top">
                <button
                  onClick={() => handleOpenDetailModal(user)}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                >
                  <HiOutlineEye size={18} />
                </button>
              </Tooltip>

              {user.role !== "ADMIN" && (
                <>
                  <Tooltip content="Chỉnh sửa" position="top">
                    <button
                      onClick={() => handleOpenUpdateModal(user)}
                      className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <HiOutlinePencil size={18} />
                    </button>
                  </Tooltip>
                  <Tooltip
                    content={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    position="top"
                  >
                    <button
                      onClick={() =>
                        openConfirm({
                          title: user.isActive
                            ? "Xác nhận khóa"
                            : "Mở khóa tài khoản",
                          message: `Bạn có chắc chắn muốn ${user.isActive ? "tạm khóa" : "mở khóa"} tài khoản "${user.username}" không?`,
                          confirmText: user.isActive ? "Khóa tài khoản" : "Mở khóa",
                          variant: user.isActive ? "danger" : "primary",
                          onConfirm: () => {
                            toggleActiveMutation.mutate(user.id);
                          },
                        })
                      }
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
                </>
              )}

              <Tooltip content="Đặt lại mật khẩu" position="top">
                <button
                  onClick={() =>
                    openModal({
                      title: "Đặt lại mật khẩu",
                      content: (
                        <ResetPasswordForm
                          user={user}
                          onSuccess={closeModal}
                          onCancel={closeModal}
                        />
                      ),
                      size: "sm",
                    })
                  }
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                >
                  <HiOutlineRefresh size={18} />
                </button>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [
      handleOpenDetailModal,
      handleOpenUpdateModal,
      openConfirm,
      toggleActiveMutation,
      deleteMutation,
      openModal,
      closeModal,
    ]
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
      {
        type: "select",
        id: "isActive",
        label: "Trạng thái",
        options: [
          { value: "", label: "Tất cả trạng thái" },
          { value: "true", label: "Đang hoạt động" },
          { value: "false", label: "Đã khóa" },
        ],
        placeholder: "Chọn trạng thái...",
      },
    ],
    []
  );

  return (
    <AnimatedContainer
      variant="slideUp"
      className="space-y-8 relative rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2 text-neutral-400">
        <HiOutlineHome size={14} className="mb-0.5" />
        <Typography variant="label" tracking="wide">
          Trang chủ
        </Typography>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">
          Quản lý tài khoản
        </Typography>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Typography variant="h1" transform="uppercase">
            Quản lý tài khoản
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all">
            <HiOutlineDownload size={16} className="text-neutral-600" />
            <Typography variant="label" color="neutral">
              Xuất Excel
            </Typography>
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
            onAdd={handleOpenCreateModal}
            addLabel="Thêm tài khoản"
          />
        </div>
      </div>
    </AnimatedContainer>
  );
}
