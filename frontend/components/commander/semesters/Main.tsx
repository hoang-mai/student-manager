"use client";

import { useCallback, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { semesterService } from "@/services/semesters";
import { Semester } from "@/types/semesters";
import { formatDateTime } from "@/utils/fn-common";
import Table from "@/library/Table";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import ActionButton from "@/library/ActionButton";
import Typography from "@/library/Typography";
import PageContainer from "@/library/PageContainer";
import { FilterField } from "@/library/table/TableFilter";
import { useConfirmStore } from "@/store/useConfirmStore";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { useModalStore } from "@/store/useModalStore";
import UpdateSemesterForm from "@/components/commander/semesters/UpdateSemesterForm";
import CreateSemesterForm from "./CreateSemesterForm";
import useTableQuery from "@/hooks/useTableQuery";
import SemesterSkeleton from "./SemesterSkeleton";
import useAppMutation from "@/hooks/useAppMutation";

export default function Main() {
  const { openConfirm } = useConfirmStore();
  const { openModal } = useModalStore();

  const {
    data: semestersData,
    isLoading: isSemestersLoading,
    isError: isSemestersError,
    refetch: refetchSemesters,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableQuery<Semester>({
    queryKey: [QUERY_KEYS.SEMESTERS],
    fetchData: semesterService.getSemesters,
  });

  const deleteMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.DELETE_SEMESTER,
    mutationFn: (id: string) => semesterService.deleteSemester(id),
    invalidateQueryKey: [QUERY_KEYS.SEMESTERS],
    successMessage: "Xóa học kỳ thành công!",
    errorMessage: "Xóa học kỳ thất bại!",
  });

  const handleAddSemester = useCallback(() => {
    openModal({
      title: "Thêm học kỳ mới",
      content: <CreateSemesterForm />,
      config: {
        mutationKey: MUTATION_KEYS.CREATE_SEMESTER,
      },
    });
  }, [openModal]);

  const handleOpenUpdateModal = useCallback(
    (semester: Semester) => {
      openModal({
        title: "Chỉnh sửa học kỳ",
        content: <UpdateSemesterForm semester={semester} />,
        size: "md",
        config: {
          mutationKey: MUTATION_KEYS.UPDATE_SEMESTER,
        },
      });
    },
    [openModal]
  );

  const columns = useMemo<ColumnDef<Semester>[]>(
    () => [
      {
        id: "code",
        header: "Mã học kỳ",
        accessorKey: "code",
        cell: (info) => (
          <Typography variant="body" weight="semibold" color="neutral">
            {info.row.original.code}
          </Typography>
        ),
      },
      {
        id: "schoolYear",
        header: "Năm học",
        accessorKey: "schoolYear",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {info.row.original.schoolYear}
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
          const semester = info.row.original;
          return (
            <div className="flex items-center justify-start gap-1">
              <ActionButton
                tooltipText="Chỉnh sửa"
                icon={HiOutlinePencil}
                onClick={() => handleOpenUpdateModal(semester)}
                color="blue"
              />

              <ActionButton
                tooltipText="Xóa học kỳ"
                icon={HiOutlineTrash}
                color="red"
                onClick={() =>
                  openConfirm({
                    title: "Xác nhận xóa",
                    message: `Bạn có chắc chắn muốn xóa học kỳ "${semester.code}" không?`,
                    confirmText: "Xóa ngay",
                    variant: "danger",
                    mutationKey: MUTATION_KEYS.DELETE_SEMESTER,
                    onConfirm: () => deleteMutation.mutate(semester.id),
                  })
                }
              />
            </div>
          );
        },
      },
    ],
    [handleOpenUpdateModal, openConfirm, deleteMutation]
  );

  const filterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "code",
        label: "Mã học kỳ",
        placeholder: "Nhập mã học kỳ...",
      },
      {
        type: "text",
        id: "schoolYear",
        label: "Năm học",
        placeholder: "VD: 2024-2025",
      },
    ],
    []
  );

  return (
    <PageContainer
      breadcrumb={[
        { label: "Tổng quan", href: "/commander" },
        { label: "Quản lý học kỳ" },
      ]}
      title="Quản lý học kỳ"
      isLoading={isSemestersLoading}
      skeleton={<SemesterSkeleton />}
      isError={isSemestersError}
      onRetry={refetchSemesters}
    >
      <div className="bg-white dark:bg-neutral-950 overflow-hidden relative transition-colors">
        <div className="px-4">
          <Table
            data={semestersData}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            filterFields={filterOptions}
            emptyText="Không tìm thấy học kỳ nào phù hợp"
            onAdd={handleAddSemester}
            addLabel="Thêm học kỳ"
          />
        </div>
      </div>
    </PageContainer>
  );
}
