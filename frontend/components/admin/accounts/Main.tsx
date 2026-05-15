"use client";

import { useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { userService } from "@/services/user";
import { UserDetailResponse, UserQueryRequest } from "@/types/user";
import { ROLES } from "@/constants/constants";
import useTableQuery from "@/hooks/useTableQuery";
import { formatDateTime } from "@/utils/fn-common";
import Table from "@/library/Table";
import Badge, { BadgeVariant } from "@/library/Badge";
import {
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineEye,
} from "react-icons/hi";
import ActionButton from "@/library/ActionButton";
import Typography from "@/library/Typography";
import PageContainer from "@/library/PageContainer";
import { FilterField } from "@/library/table/TableFilter";
import { useConfirmStore } from "@/store/useConfirmStore";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { useModalStore } from "@/store/useModalStore";
import useAppMutation from "@/hooks/useAppMutation";
import ResetPasswordForm from "./ResetPasswordForm";
import CreateUserForm from "./CreateUserForm";
import UpdateUserForm from "./UpdateUserForm";
import DetailUserForm from "./DetailUserForm";
import UpdateBatchStudents from "./UpdateBatchStudents";
import AccountSkeleton from "./AccountSkeleton";

export default function Main() {
  const { openConfirm } = useConfirmStore();
  const { openModal } = useModalStore();

  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
    refetch: refetchUsers,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableQuery<UserDetailResponse, UserQueryRequest>({
    queryKey: [QUERY_KEYS.USERS],
    fetchData: (params) => userService.getAllUsers(params),
  });

  const toggleActiveMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.TOGGLE_USER_ACTIVE,
    mutationFn: (id: string | number) => userService.toggleActive(id),
    invalidateQueryKey: [QUERY_KEYS.USERS],
    successMessage: "Cập nhật trạng thái thành công!",
    errorMessage: "Cập nhật trạng thái thất bại!",
    closeConfirmOnSuccess: true,
  });

  const deleteMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.DELETE_USER,
    mutationFn: (id: string | number) => userService.deleteUser(id),
    invalidateQueryKey: [QUERY_KEYS.USERS],
    successMessage: "Xóa tài khoản thành công!",
    errorMessage: "Xóa tài khoản thất bại!",
    closeConfirmOnSuccess: true,
  });

  const handleOpenCreateModal = useCallback(() => {
    openModal({
      title: "Thêm tài khoản mới",
      content: <CreateUserForm />,
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.CREATE_USER,
      },
    });
  }, [openModal]);

  const handleOpenUpdateModal = useCallback(
    (user: UserDetailResponse) => {
      openModal({
        title: "Chỉnh sửa tài khoản",
        content: (
          <UpdateUserForm
            user={user}
          />
        ),
        size: "lg",
        config: {
          mutationKey: MUTATION_KEYS.UPDATE_USER,
        },
      });
    },
    [openModal]
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

  const handleOpenBulkUpdateModal = useCallback(() => {
    openModal({
      title: "Cập nhật học viên hàng loạt",
      content: (
        <UpdateBatchStudents
        />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.UPDATE_BATCH_STUDENTS,
      },
    });
  }, [openModal]);

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
          const { fullName, email } = info.row.original.profile || {};
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
          <Typography variant="caption" weight="semibold" color="gray" className="whitespace-nowrap">
            {formatDateTime(info.row.original.createdAt)}
          </Typography>
        ),
      },
      {
        id: "updatedAt",
        header: "Ngày cập nhật",
        accessorKey: "updatedAt",
        cell: (info) => (
          <Typography variant="caption" weight="semibold" color="gray" className="whitespace-nowrap">
            {formatDateTime(info.row.original.updatedAt)}
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
              <ActionButton
                tooltipText="Xem chi tiết"
                icon={HiOutlineEye}
                onClick={() => handleOpenDetailModal(user)}
                color="green"
              />

              {user.role !== "ADMIN" && (
                <>
                  <ActionButton
                    tooltipText="Chỉnh sửa"
                    icon={HiOutlinePencil}
                    onClick={() => handleOpenUpdateModal(user)}
                    color="blue"
                  />

                  <ActionButton
                    tooltipText={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    icon={HiOutlineLockClosed}
                    color="secondary"
                    onClick={() =>
                      openConfirm({
                        title: user.isActive
                          ? "Xác nhận khóa"
                          : "Mở khóa tài khoản",
                        message: `Bạn có chắc chắn muốn ${user.isActive ? "tạm khóa" : "mở khóa"} tài khoản "${user.username}" không?`,
                        confirmText: user.isActive ? "Khóa tài khoản" : "Mở khóa",
                        variant: user.isActive ? "danger" : "primary",
                        mutationKey: MUTATION_KEYS.TOGGLE_USER_ACTIVE,
                        onConfirm: () => {
                          toggleActiveMutation.mutate(user.id);
                        },
                      })
                    }
                  />

                  <ActionButton
                    tooltipText="Xóa tài khoản"
                    icon={HiOutlineTrash}
                    color="red"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận xóa",
                        message: `Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${user.username}" không? Hành động này không thể hoàn tác.`,
                        confirmText: "Xóa ngay",
                        variant: "danger",
                        mutationKey: MUTATION_KEYS.DELETE_USER,
                        onConfirm: () => deleteMutation.mutate(user.id),
                      })
                    }
                  />
                </>
              )}

              <ActionButton
                tooltipText="Đặt lại mật khẩu"
                icon={HiOutlineRefresh}
                color="amber"
                onClick={() =>
                  openModal({
                    title: "Đặt lại mật khẩu",
                    content: <ResetPasswordForm user={user} />,
                    size: "sm",
                    config: {
                      mutationKey: MUTATION_KEYS.RESET_USER_PASSWORD,
                    },
                  })
                }
              />
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
      openModal
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
    <PageContainer
      breadcrumb={[
        { label: "Tổng quan", href: "/admin" },
        { label: "Quản lý tài khoản" },
      ]}
      title="Quản lý tài khoản"
      isLoading={isUsersLoading}
      skeleton={<AccountSkeleton />}
      isError={isUsersError}
      onRetry={refetchUsers}
    >
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all cursor-pointer">
          <HiOutlineDownload size={16} className="text-neutral-600" />
          <Typography variant="label" color="neutral">
            Xuất Excel
          </Typography>
        </button>
      </div>

      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <Table
            data={usersData}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            filterFields={filterOptions}
            emptyText="Không tìm thấy tài khoản nào phù hợp"
            onAdd={handleOpenCreateModal}
            addLabel="Thêm tài khoản"
            onBulkUpdate={handleOpenBulkUpdateModal}
            bulkUpdateLabel="Cập nhật hàng loạt"
          />
        </div>
      </div>
    </PageContainer>
  );
}
