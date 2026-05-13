"use client";

import { useMemo, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { classService } from "@/services/classes";
import { universityService } from "@/services/universities";
import { Class } from "@/types/classes";
import { formatDateTime } from "@/utils/fn-common";
import AnimatedContainer from "@/library/AnimatedContainer";
import Table from "@/library/Table";
import {
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineHome,
  HiOutlineChevronRight,
} from "react-icons/hi";
import Tooltip from "@/library/Tooltip";
import Typography from "@/library/Typography";
import { FilterField } from "@/library/table/TableFilter";
import { useConfirmStore } from "@/store/useConfirmStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useModalStore } from "@/store/useModalStore";
import Link from "next/link";
import UpdateClassForm from "@/components/commander/classes/UpdateClassForm";
import CreateClassForm from "./CreateClassForm";
import useTableQuery from "@/hooks/useTableQuery";
import ClassSkeleton from "./ClassSkeleton";
import ErrorState from "@/library/ErrorState";
import { DEFAULT_PAGE } from "@/constants/constants";
import useAppMutation from "@/hooks/useAppMutation";

export default function Main() {
  const { openConfirm } = useConfirmStore();
  const { openModal } = useModalStore();

  const {
    data: universities,
    fetchNextPage: fetchNextUniversities,
    hasNextPage: hasNextUniversities,
    isFetchingNextPage: isFetchingNextUniversities,
    isLoading: isLoadingUniversities,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES],
    queryFn: ({ pageParam }) =>
      universityService.getUniversities({
        page: pageParam,
        limit: DEFAULT_PAGE.PAGE_SIZE,
      }),
    initialPageParam: DEFAULT_PAGE.PAGE_INDEX + 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const {
    data: classesData,
    isLoading: isClassesLoading,
    isError: isClassesError,
    refetch: refetchClasses,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
  } = useTableQuery<Class>({
    queryKey: [QUERY_KEYS.CLASSES],
    fetchData: (params) => classService.getClasses(params),
  });

  const deleteMutation = useAppMutation({
    mutationFn: (id: string) => classService.deleteClass(id),
    invalidateQueryKey: [QUERY_KEYS.CLASSES],
    successMessage: "Xóa lớp học thành công!",
    errorMessage: "Xóa lớp học thất bại!",
    closeConfirmOnSuccess: true,
    enableConfirmLoading: true
  });

  const handleAddClass = useCallback(() => {
    openModal({
      title: "Thêm lớp học mới",
      content: <CreateClassForm />,
    });
  }, [openModal]);

  const handleOpenUpdateModal = useCallback(
    (cls: Class) => {
      openModal({
        title: "Chỉnh sửa lớp học",
        content: (
          <UpdateClassForm
            cls={cls}
          />
        ),
        size: "md",
      });
    },
    [openModal]
  );

  const columns = useMemo<ColumnDef<Class>[]>(
    () => [
      {
        id: "className",
        header: "Tên lớp",
        accessorKey: "className",
        cell: (info) => (
          <Typography variant="body" weight="semibold" color="neutral">
            {info.row.original.className}
          </Typography>
        ),
      },
      {
        id: "universityName",
        header: "Trường đại học",
        accessorKey: "universityName",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {info.row.original.universityName || "---"}
          </Typography>
        ),
      },
      {
        id: "organizationName",
        header: "Khoa/Ngành",
        accessorKey: "organizationName",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {info.row.original.organizationName || "---"}
          </Typography>
        ),
      },
      {
        id: "levelName",
        header: "Trình độ",
        accessorKey: "levelName",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {info.row.original.levelName || "---"}
          </Typography>
        ),
      },
      {
        id: "studentCount",
        header: "Số học viên",
        accessorKey: "studentCount",
        cell: (info) => (
          <Typography variant="body" color="neutral">
            {info.row.original.studentCount}
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
          const cls = info.row.original;
          return (
            <div className="flex items-center justify-start gap-2">
              <Tooltip content="Chỉnh sửa" position="top">
                <button
                  onClick={() => handleOpenUpdateModal(cls)}
                  className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <HiOutlinePencil size={18} />
                </button>
              </Tooltip>

              <Tooltip content="Xóa lớp" position="top">
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Xác nhận xóa",
                      message: `Bạn có chắc chắn muốn xóa lớp "${cls.className}" không?`,
                      confirmText: "Xóa ngay",
                      variant: "danger",
                      onConfirm: () => deleteMutation.mutate(cls.id),
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
    [handleOpenUpdateModal, openConfirm, deleteMutation]
  );

  const universityOptions = useMemo(() => {
    const options = [{ value: "", label: "Tất cả trường" }];
    if (universities) {
      universities.forEach((uni) => {
        options.push({ value: uni.id, label: uni.universityName });
      });
    }
    return options;
  }, [universities]);

  const filterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "className",
        label: "Tên lớp",
        placeholder: "Nhập tên lớp...",
      },
      {
        type: "select",
        id: "universityId",
        label: "Trường đại học",
        options: universityOptions,
        placeholder: "Chọn trường...",
        hasNextPage: hasNextUniversities,
        isFetchingNextPage: isFetchingNextUniversities,
        onLoadMore: fetchNextUniversities,
        isLoading: isLoadingUniversities,
      },
    ],
    [
      universityOptions,
      hasNextUniversities,
      isFetchingNextUniversities,
      fetchNextUniversities,
      isLoadingUniversities,
    ]
  );

  if (isClassesLoading) {
    return <ClassSkeleton />;
  }

  if (isClassesError) {
    return <ErrorState onRetry={refetchClasses} />;
  }

  return (
    <AnimatedContainer
      variant="slideUp"
      className="space-y-8 rounded-2xl bg-white p-6 min-h-screen"
    >
      <div className="flex items-center gap-2 text-neutral-400">
        <Link
          href="/commander"
          className="flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer group"
        >
          <HiOutlineHome
            size={14}
            className="mb-0.5 group-hover:scale-110 transition-transform"
          />
          <Typography
            variant="label"
            tracking="wide"
            className="cursor-pointer"
          >
            Tổng quan
          </Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">
          Quản lý lớp học
        </Typography>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Typography variant="h1" transform="uppercase">
            Quản lý lớp học
          </Typography>
        </div>
      </div>

      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <Table
            data={classesData}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            filterFields={filterOptions}
            emptyText="Không tìm thấy lớp học nào phù hợp"
            onAdd={handleAddClass}
            addLabel="Thêm lớp học"
          />
        </div>
      </div>
    </AnimatedContainer>
  );
}
