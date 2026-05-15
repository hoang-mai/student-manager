"use client";

import { useMemo, useCallback } from "react";
import Typography from "@/library/Typography";
import ClassSkeleton from "./ClassSkeleton";
import AnimatedContainer from "@/library/AnimatedContainer";
import { useQuery } from "@tanstack/react-query";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useModalStore } from "@/store/useModalStore";
import { classService } from "@/services/classes";
import { organizationService } from "@/services/organizations";
import { universityService } from "@/services/universities";
import { Class } from "@/types/classes";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import CreateClassForm from "./CreateClassForm";
import UpdateClassForm from "./UpdateClassForm";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/library/Table";
import { FilterField } from "@/library/table/TableFilter";
import Tooltip from "@/library/Tooltip";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi";
import Link from "next/link";
import { formatDateTime } from "@/utils/fn-common";
import ErrorState from "@/library/ErrorState";
import useTableQuery from "@/hooks/useTableQuery";
import useAppMutation from "@/hooks/useAppMutation";

interface Props {
  universityId: string;
  organizationId: string;
  educationLevelId: string;
}

export default function Main({ universityId, organizationId, educationLevelId }: Props) {
  const { openConfirm } = useConfirmStore();
  const { openModal } = useModalStore();

  const { data: organizationData, isLoading: isOrganizationLoading, isError: isOrganizationError, refetch: refetchOrganization } = useQuery({
    queryKey: [QUERY_KEYS.ORGANIZATIONS, organizationId],
    queryFn: () => organizationService.getOrganization(organizationId),
    select: (res) => res.data,
  });

  const { data: universityData, isLoading: isUniversityLoading, isError: isUniversityError, refetch: refetchUniversity } = useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, universityId],
    queryFn: () => universityService.getUniversity(universityId),
    select: (res) => res.data,
  });

  const { data: educationLevelData, isLoading: isEducationLevelLoading, isError: isEducationLevelError, refetch: refetchEducationLevel } = useQuery({
    queryKey: [QUERY_KEYS.EDUCATION_LEVELS, educationLevelId],
    queryFn: () => organizationService.getEducationLevel(educationLevelId),
    select: (res) => res.data,
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
    queryKey: [QUERY_KEYS.CLASSES, educationLevelId],
    fetchData: (params) => classService.getClasses({ ...params, educationLevelId }),
  });

  const handleOpenCreateClassModal = () => {
    openModal({
      title: "Thêm lớp học mới",
      content: (
        <CreateClassForm educationLevelId={educationLevelId} />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.CREATE_CLASS,
      },
    });
  };

  const handleOpenUpdateClassModal = useCallback((cls: Class) => {
    openModal({
      title: "Chỉnh sửa lớp học",
      content: (
        <UpdateClassForm cls={cls} educationLevelId={educationLevelId} />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.UPDATE_CLASS,
      },
    });
  }, [educationLevelId, openModal]);

  const deleteClassMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.DELETE_CLASS,
    mutationFn: (id: string) => classService.deleteClass(id),
    invalidateQueryKey: [QUERY_KEYS.CLASSES, educationLevelId],
    successMessage: "Xóa lớp thành công",
    errorMessage: "Xóa lớp thất bại",
    closeConfirmOnSuccess: true,
  });


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
          const cls = info.row.original;
          return (
            <div className="flex items-center justify-start gap-2">
              <Tooltip content="Chỉnh sửa" position="top">
                <button
                  onClick={() => handleOpenUpdateClassModal(cls)}
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
                      mutationKey: MUTATION_KEYS.DELETE_CLASS,
                      onConfirm: () => deleteClassMutation.mutate(cls.id),
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
    [handleOpenUpdateClassModal, openConfirm, deleteClassMutation]
  );

  const filterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "text",
        id: "className",
        label: "Tên lớp",
        placeholder: "Nhập tên lớp...",
      },
    ],
    []
  );

  if (isOrganizationLoading || isUniversityLoading || isEducationLevelLoading || isClassesLoading) {
    return <ClassSkeleton />;
  }

  if (isOrganizationError || isUniversityError || isEducationLevelError || isClassesError) {
    return <ErrorState onRetry={() => { refetchOrganization(); refetchUniversity(); refetchEducationLevel(); refetchClasses(); }} />;
  }

  return (
    <AnimatedContainer variant="slideUp" className="space-y-8 relative rounded-2xl bg-white p-6 min-h-screen">
      <div className="flex items-center gap-2 text-neutral-400">
        <Link href="/commander" className="flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer group">
          <HiOutlineHome size={14} className="mb-0.5 group-hover:scale-110 transition-transform" />
          <Typography variant="label" tracking="wide">Tổng quan</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Link
          href="/commander/universities"
          className="hover:text-primary-600 transition-colors"
        >
          <Typography variant="label" tracking="wide">
            Cơ sở đào tạo
          </Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Link href={`/commander/universities/${universityId}`} className="hover:text-primary-600 transition-colors cursor-pointer">
          <Typography variant="label" tracking="wide">
            {universityData?.universityName}
          </Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" tracking="wide">
          {organizationData?.organizationName}
        </Typography>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">
          {educationLevelData?.levelName}
        </Typography>
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Typography variant="h1" transform="uppercase">
            {`Lớp học - ${educationLevelData?.levelName}`}
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
            emptyText="Không tìm thấy lớp học nào"
            onAdd={() => handleOpenCreateClassModal()}
            addLabel="Thêm lớp học"
          />
        </div>
      </div>
    </AnimatedContainer>
  );
}
