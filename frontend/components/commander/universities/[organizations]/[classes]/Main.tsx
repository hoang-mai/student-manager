"use client";

import { useMemo, useCallback } from "react";
import Typography from "@/library/Typography";
import AnimatedContainer from "@/library/AnimatedContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/useToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useModalStore } from "@/store/useModalStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { classService } from "@/services/classes";
import { Class } from "@/types/classes";
import { QUERY_KEYS } from "@/constants/query-keys";
import CreateClassForm from "./CreateClassForm";
import UpdateClassForm from "./UpdateClassForm";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/library/Table";
import { FilterField } from "@/library/table/TableFilter";
import Tooltip from "@/library/Tooltip";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi";
import Link from "next/link";
import { formatDateTime } from "@/utils/fn-common";

interface Props {
  educationLevelId: string;
}

export default function Main({ educationLevelId }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { openConfirm, closeConfirm, setLoading } = useConfirmStore();
  const { openModal, closeModal } = useModalStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const handleOpenCreateClassModal = () => {
    openModal({
      title: "Thêm lớp học mới",
      content: (
        <CreateClassForm
          educationLevelId={educationLevelId}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
      size: "md",
    });
  };

  const handleOpenUpdateClassModal = (cls: Class) => {
    openModal({
      title: "Chỉnh sửa lớp học",
      content: (
        <UpdateClassForm
          cls={cls}
          educationLevelId={educationLevelId}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
      size: "md",
    });
  };

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => {
      setLoading(true);
      showLoading();
      return classService.deleteClass(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES, educationLevelId] });
      addToast({ message: "Xóa lớp thành công", variant: "success" });
      closeConfirm();
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
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
        header: "Số học viên",
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
    [educationLevelId, openConfirm, deleteClassMutation]
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

  return (
    <AnimatedContainer variant="slideUp" className="space-y-8 relative rounded-2xl bg-white p-6 min-h-screen">
      <div className="flex items-center gap-2 text-neutral-400">
        <Link href="/commander" className="flex items-center gap-2 hover:text-primary-600 transition-colors cursor-pointer group">
          <HiOutlineHome size={14} className="mb-0.5 group-hover:scale-110 transition-transform" />
          <Typography variant="label" tracking="wide">Tổng quan</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Link href="/commander/universities" className="hover:text-primary-600 transition-colors cursor-pointer">
          <Typography variant="label" tracking="wide">Cơ sở đào tạo</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">Quản lý lớp học</Typography>
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
            fetchData={(params) => classService.getClasses({ ...params, educationLevelId })}
            columns={columns}
            queryKey={[QUERY_KEYS.CLASSES, educationLevelId]}
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
