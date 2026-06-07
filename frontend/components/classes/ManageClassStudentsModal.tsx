"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import ActionButton from "@/library/ActionButton";
import Button from "@/library/Button";
import Checkbox from "@/library/Checkbox";
import Divide from "@/library/Divide";
import Table from "@/library/Table";
import Typography from "@/library/Typography";
import useAppMutation from "@/hooks/useAppMutation";
import useTableQuery from "@/hooks/useTableQuery";
import { ROLES } from "@/constants/constants";
import { QUERY_KEYS } from "@/constants/query-keys";
import { classService } from "@/services/classes";
import { userService } from "@/services/user";
import { useConfirmStore } from "@/store/useConfirmStore";
import { Class } from "@/types/classes";
import {
  Student,
  StudentProfileQueryRequest,
  UserDetailResponse,
  UserQueryRequest,
} from "@/types/user";
import { textOrDash } from "@/utils/fn-common";
import { FilterField } from "@/library/table/TableFilter";

interface Props {
  cls: Class;
}

const getUserProfile = (user: UserDetailResponse) => user.profile || user.Profile || null;

export default function ManageClassStudentsModal({ cls }: Props) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  const { openConfirm } = useConfirmStore();

  const studentsQueryKey = [QUERY_KEYS.CLASSES, cls.id, "students"];
  const availableStudentsQueryKey = [
    QUERY_KEYS.STUDENT_PROFILES,
    "assign-to-class",
    cls.id,
  ];

  const {
    data: studentsData,
    isLoading,
    isError,
    refetch,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableQuery<Student, StudentProfileQueryRequest>({
    queryKey: studentsQueryKey,
    fetchData: (params) => classService.getClassStudents(cls.id, params),
  });

  const {
    data: availableStudentsData,
    pagination: availablePagination,
    setPagination: setAvailablePagination,
    columnFilters: availableColumnFilters,
    setColumnFilters: setAvailableColumnFilters,
    sorting: availableSorting,
    setSorting: setAvailableSorting,
  } = useTableQuery<UserDetailResponse, UserQueryRequest>({
    queryKey: availableStudentsQueryKey,
    fetchData: (params) =>
      userService.getAllUsers({
        ...params,
        role: ROLES.STUDENT.ROLE,
      }),
  });

  const invalidateClassStudents = async () => {
    await queryClient.invalidateQueries({ queryKey: studentsQueryKey });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
    await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENT_PROFILES] });
  };

  const assignMutation = useAppMutation({
    mutationKey: [QUERY_KEYS.CLASSES, cls.id, "assign-students"],
    mutationFn: (userIds: string[]) =>
      classService.assignStudents(cls.id, { userIds }),
    successMessage: "Thêm học viên vào lớp thành công!",
    errorMessage: "Thêm học viên vào lớp thất bại!",
    onSuccess: async () => {
      setSelectedUserIds(new Set());
      await invalidateClassStudents();
    },
  });

  const removeMutation = useAppMutation({
    mutationKey: [QUERY_KEYS.CLASSES, cls.id, "remove-student"],
    mutationFn: (userId: string) => classService.removeStudent(cls.id, userId),
    successMessage: "Đã bỏ học viên khỏi lớp!",
    errorMessage: "Bỏ học viên khỏi lớp thất bại!",
    onSuccess: invalidateClassStudents,
  });

  const selectedIds = useMemo(() => Array.from(selectedUserIds), [selectedUserIds]);

  const toggleStudent = (userId?: string | null) => {
    if (!userId) return;
    setSelectedUserIds((current) => {
      const next = new Set(current);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const availableColumns = useMemo<ColumnDef<UserDetailResponse>[]>(
    () => [
      {
        id: "select",
        header: "Chọn",
        size: 72,
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original;
          const profile = getUserProfile(user);
          const isAlreadyInClass = profile?.classId === cls.id;

          return (
            <Checkbox
              checked={selectedUserIds.has(user.id)}
              disabled={isAlreadyInClass || assignMutation.isPending}
              onChange={() => toggleStudent(user.id)}
              size="sm"
            />
          );
        },
      },
      {
        id: "code",
        header: "Mã học viên",
        accessorKey: "code",
        cell: (info) => (
          <Typography variant="body" weight="semibold" color="neutral">
            {textOrDash(getUserProfile(info.row.original)?.code)}
          </Typography>
        ),
      },
      {
        id: "fullName",
        header: "Họ và tên",
        accessorKey: "fullName",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(
              getUserProfile(info.row.original)?.fullName ||
                info.row.original.username
            )}
          </Typography>
        ),
      },
      {
        id: "unit",
        header: "Đơn vị",
        accessorKey: "unit",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(getUserProfile(info.row.original)?.unit)}
          </Typography>
        ),
      },
      {
        id: "class",
        header: "Lớp hiện tại",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(getUserProfile(info.row.original)?.class?.className)}
          </Typography>
        ),
      },
    ],
    [assignMutation.isPending, cls.id, selectedUserIds]
  );

  const currentColumns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        id: "code",
        header: "Mã học viên",
        accessorKey: "code",
        cell: (info) => (
          <Typography variant="body" weight="semibold" color="neutral">
            {textOrDash(info.row.original.code)}
          </Typography>
        ),
      },
      {
        id: "fullName",
        header: "Họ và tên",
        accessorKey: "fullName",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(info.row.original.fullName)}
          </Typography>
        ),
      },
      {
        id: "unit",
        header: "Đơn vị",
        accessorKey: "unit",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(info.row.original.unit)}
          </Typography>
        ),
      },
      {
        id: "rank",
        header: "Cấp bậc",
        accessorKey: "rank",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {textOrDash(info.row.original.rank)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: (info) => {
          const student = info.row.original;
          const userId = student.User?.id;

          return (
            <ActionButton
              tooltipText={userId ? "Bỏ khỏi lớp" : "Thiếu userId"}
              icon={HiOutlineTrash}
              color="red"
              disabled={!userId || removeMutation.isPending}
              onClick={() => {
                if (!userId) return;
                openConfirm({
                  title: "Bỏ học viên khỏi lớp",
                  message: `Bạn có chắc chắn muốn bỏ "${student.fullName || student.code}" khỏi lớp "${cls.className}" không?`,
                  confirmText: "Bỏ khỏi lớp",
                  variant: "danger",
                  mutationKey: [QUERY_KEYS.CLASSES, cls.id, "remove-student"],
                  onConfirm: () => removeMutation.mutate(userId),
                });
              }}
            />
          );
        },
      },
    ],
    [cls.className, cls.id, openConfirm, removeMutation]
  );

  const availableFilterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "code",
        label: "Mã học viên",
        placeholder: "Nhập mã học viên...",
      },
      {
        type: "text",
        id: "fullName",
        label: "Họ và tên",
        placeholder: "Nhập họ tên...",
      },
      {
        type: "text",
        id: "unit",
        label: "Đơn vị",
        placeholder: "Nhập đơn vị...",
      },
    ],
    []
  );

  const currentFilterOptions = availableFilterOptions;

  return (
    <div className="max-h-[82vh] space-y-5 overflow-y-auto py-1 pr-2">
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
        <Typography variant="body" weight="bold" color="neutral">
          {cls.className}
        </Typography>
        <Typography variant="caption" color="gray" className="mt-1 block">
          Tích chọn học viên từ danh sách rồi thêm vào lớp.
        </Typography>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Typography variant="body" weight="bold" color="neutral">
              Danh sách học viên
            </Typography>
            <Typography variant="caption" color="gray" className="mt-0.5 block">
              Đã chọn {selectedIds.length} học viên
            </Typography>
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={!selectedIds.length || assignMutation.isPending}
            onClick={() => setSelectedUserIds(new Set())}
          >
            Bỏ chọn
          </Button>
          <Button
            type="button"
            icon={HiOutlineUserAdd}
            disabled={!selectedIds.length}
            isLoading={assignMutation.isPending}
            onClick={() => assignMutation.mutate(selectedIds)}
          >
            Thêm vào lớp
          </Button>
        </div>

        <Table
          data={availableStudentsData}
          columns={availableColumns}
          pagination={availablePagination}
          onPaginationChange={setAvailablePagination}
          columnFilters={availableColumnFilters}
          onColumnFiltersChange={setAvailableColumnFilters}
          sorting={availableSorting}
          onSortingChange={setAvailableSorting}
          filterFields={availableFilterOptions}
          emptyText="Không tìm thấy học viên phù hợp"
          className="shadow-none"
        />
      </div>

      <Divide />

      <Typography variant="body" weight="bold" color="neutral">
        Học viên trong lớp
      </Typography>

      <Table
        data={studentsData}
        columns={currentColumns}
        pagination={pagination}
        onPaginationChange={setPagination}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        sorting={sorting}
        onSortingChange={setSorting}
        filterFields={currentFilterOptions}
        emptyText="Lớp này chưa có học viên"
        className="shadow-none"
      />

      {isError && (
        <div className="flex justify-end">
          <Button type="button" variant="ghost" onClick={() => refetch()}>
            Tải lại danh sách
          </Button>
        </div>
      )}

      {isLoading && (
        <Typography variant="caption" color="gray" className="block text-right">
          Đang tải danh sách học viên...
        </Typography>
      )}
    </div>
  );
}
