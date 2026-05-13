"use client";

import { useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { dutyScheduleService } from "@/services/duty-schedules";
import { DutySchedule } from "@/types/duty-schedules";
import { useModalStore } from "@/store/useModalStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import Typography from "@/library/Typography";
import AnimatedContainer from "@/library/AnimatedContainer";
import Badge from "@/library/Badge";
import Table from "@/library/Table";
import { FilterField } from "@/library/table/TableFilter";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineHome,
  HiOutlineChevronRight,
} from "react-icons/hi";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/utils/fn-common";
import { RANKS } from "@/constants/constants";
import useTableQuery from "@/hooks/useTableQuery";
import ErrorState from "@/library/ErrorState";
import CreateDutyScheduleForm from "./CreateDutyScheduleForm";
import UpdateDutyScheduleForm from "./UpdateDutyScheduleForm";
import DutyScheduleSkeleton from "./DutyScheduleSkeleton";
import Tooltip from "@/library/Tooltip";
import useAppMutation from "@/hooks/useAppMutation";

export default function DutySchedulesMain() {
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableQuery<DutySchedule>({
    queryKey: [QUERY_KEYS.DUTY_SCHEDULES],
    fetchData: (params) => dutyScheduleService.getDutySchedules(params),
  });

  const deleteMutation = useAppMutation({
    mutationFn: (id: string) => dutyScheduleService.deleteDutySchedule(id),
    invalidateQueryKey: [QUERY_KEYS.DUTY_SCHEDULES],
    successMessage: "Xóa ca trực thành công!",
    errorMessage: "Xóa ca trực thất bại!",
    closeConfirmOnSuccess: true,
    enableConfirmLoading: true
  });

  const handleAdd = () => {
    openModal({
      title: "Phân công ca trực mới",
      content: (
        <CreateDutyScheduleForm />
      ),
    });
  };

  const handleEdit = useCallback(
    (schedule: DutySchedule) => {
      openModal({
        title: "Cập nhật ca trực",
        content: (
          <UpdateDutyScheduleForm
            schedule={schedule}
          />
        ),
      });
    },
    [openModal]
  );

  const columns = useMemo<ColumnDef<DutySchedule>[]>(
    () => [
      {
        id: "fullName",
        header: "Người trực",
        accessorKey: "fullName",
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div>
              <Typography variant="body" weight="semibold" color="neutral">
                {info.row.original.fullName}
              </Typography>
              <Typography variant="caption" color="gray">
                {info.row.original.rank}
              </Typography>
            </div>
          </div>
        ),
      },
      {
        id: "position",
        header: "Nhiệm vụ",
        accessorKey: "position",
        cell: (info) => (
          <Badge variant="primary">{info.row.original.position}</Badge>
        ),
      },
      {
        id: "phoneNumber",
        header: "Số điện thoại",
        accessorKey: "phoneNumber",
        cell: (info) => (
          <Typography
            variant="body"
            weight="semibold"
            color="neutral"
            className="whitespace-nowrap"
          >
            {info.row.original.phoneNumber}
          </Typography>
        ),
      },
      {
        id: "workDay",
        header: "Ngày trực",
        accessorKey: "workDay",
        cell: (info) => (
          <Typography
            variant="body"
            weight="semibold"
            color="neutral"
            className="whitespace-nowrap"
          >
            {formatDate(info.row.original.workDay)}
          </Typography>
        ),
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        accessorKey: "createdAt",
        cell: (info) => (
          <Typography
            variant="caption"
            weight="semibold"
            color="gray"
            className="whitespace-nowrap"
          >
            {formatDateTime(info.row.original.createdAt)}
          </Typography>
        ),
      },
      {
        id: "updatedAt",
        header: "Ngày cập nhật",
        accessorKey: "updatedAt",
        cell: (info) => (
          <Typography
            variant="caption"
            weight="semibold"
            color="gray"
            className="whitespace-nowrap"
          >
            {formatDateTime(info.row.original.updatedAt)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Hành động",
        cell: (info) => {
          const schedule = info.row.original;
          return (
            <div className="flex items-center justify-start gap-2">
              <Tooltip content="Chỉnh sửa" position="top">
                <button
                  onClick={() => handleEdit(schedule)}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <HiOutlinePencil size={18} />
                </button>
              </Tooltip>

              <Tooltip content="Xóa" position="top">
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Xác nhận xóa",
                      message: "Bạn có chắc chắn muốn xóa ca trực này không?",
                      confirmText: "Xóa ngay",
                      variant: "danger",
                      onConfirm: () => deleteMutation.mutate(schedule.id),
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
    [deleteMutation, handleEdit, openConfirm]
  );

  const filterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "fullName",
        label: "Tên người trực",
        placeholder: "Nhập tên...",
      },
      {
        type: "text",
        id: "position",
        label: "Nhiệm vụ",
        placeholder: "Nhập nhiệm vụ...",
      },
      {
        type: "select",
        id: "rank",
        label: "Cấp bậc",
        placeholder: "Chọn cấp bậc...",
        options: Object.values(RANKS).map((rank) => ({
          value: rank,
          label: rank,
        })),
      },
    ],
    []
  );

  if (isLoading) {
    return <DutyScheduleSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Đã có lỗi xảy ra"}
        onRetry={refetch}
      />
    );
  }

  return (
    <AnimatedContainer className="space-y-6 p-6 bg-white rounded-2xl min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-neutral-400">
        <Link
          href="/commander"
          className="flex items-center gap-2 hover:text-primary-600 transition-colors group"
        >
          <HiOutlineHome
            size={14}
            className="mb-0.5 group-hover:scale-110 transition-transform"
          />
          <Typography variant="label" tracking="wide">
            Tổng quan
          </Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">
          Phân công lịch trực
        </Typography>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography variant="h1" transform="uppercase">
            Phân công lịch trực
          </Typography>
          <Typography variant="body" className="text-neutral-500 mt-1">
            Quản lý và phân công ca trực cho các chỉ huy
          </Typography>
        </div>
      </div>

      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <Table
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            filterFields={filterOptions}
            emptyText="Không tìm thấy lịch trực nào phù hợp"
            onAdd={handleAdd}
            addLabel="Phân công lịch trực"
          />
        </div>
      </div>
    </AnimatedContainer>
  );
}
