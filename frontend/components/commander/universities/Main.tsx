"use client";

import {
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  HiOutlineOfficeBuilding,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
} from "react-icons/hi";
import Link from "next/link";
import UniversitySkeleton from "./UniversitySkeleton";
import { useModalStore } from "@/store/useModalStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import Badge from "@/library/Badge";
import ActionButton from "@/library/ActionButton";
import PageContainer from "@/library/PageContainer";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { universityService } from "@/services/universities";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { DEFAULT_PAGE } from "@/constants/constants";
import { University } from "@/types/universities";

import CreateUniversityForm from "./CreateUniversityForm";
import UpdateUniversityForm from "./UpdateUniversityForm";
import Typography from "@/library/Typography";
import Button from "@/library/Button";
import useAppMutation from "@/hooks/useAppMutation";

export default function Main() {
  const { openModal } = useModalStore();
  const { openConfirm } = useConfirmStore();

  const {
    data: universities,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  const setSentinelRef = useInfiniteScroll({
    callback: fetchNextPage,
    hasNextPage,
    isFetching: isFetchingNextPage,
  });

  const toggleUniversityStatusMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.TOGGLE_UNIVERSITY_STATUS,
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => universityService.toggleUniversityStatus(id, status),
    invalidateQueryKey: [QUERY_KEYS.UNIVERSITIES],
    successMessage: "Cập nhật trạng thái thành công",
    errorMessage: "Cập nhật trạng thái thất bại!",
    closeConfirmOnSuccess: true,
  });

  const deleteUniversityMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.DELETE_UNIVERSITY,
    mutationFn: (id: string) => universityService.deleteUniversity(id),
    invalidateQueryKey: [QUERY_KEYS.UNIVERSITIES],
    successMessage: "Xóa trường đại học thành công",
    errorMessage: "Xóa trường đại học thất bại!",
    closeConfirmOnSuccess: true,
  });

  const handleOpenCreateModal = () => {
    openModal({
      title: "Thêm trường đại học",
      content: <CreateUniversityForm />,
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.CREATE_UNIVERSITY,
      },
    });
  };

  const handleOpenUpdateModal = (uni: University) => {
    openModal({
      title: "Chỉnh sửa trường đại học",
      content: (
        <UpdateUniversityForm university={uni} />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.UPDATE_UNIVERSITY,
      },
    });
  };

  return (
    <PageContainer
      breadcrumb={[
        { label: "Tổng quan", href: "/commander" },
        { label: "Cơ sở đào tạo" },
      ]}
      title="Quản lý cơ sở đào tạo"
      isLoading={isLoading}
      skeleton={<UniversitySkeleton />}
      isError={isError}
      onRetry={refetch}
    >
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-primary-600 rounded-xl text-[11px]! font-black! uppercase tracking-wider text-white hover:bg-primary-700 hover:border-primary-700 transition-all shadow-lg shadow-primary-600/20 cursor-pointer active:scale-95 h-auto"
          icon={HiOutlinePlus}
        >
          Thêm trường đại học
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {universities && universities.length > 0 ? (
          <>
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6 bg-linear-to-r from-neutral-50/50 to-white flex items-center justify-between border-b border-neutral-50">
                  <Link
                    href={`/commander/universities/${uni.id}`}
                    className="flex items-center gap-4 cursor-pointer group flex-1"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                      <HiOutlineOfficeBuilding size={24} />
                    </div>
                    <div>
                      <Typography
                        variant="h3"
                        className="group-hover:text-primary-600 transition-colors"
                      >
                        {uni.universityName}
                      </Typography>
                      <div className="flex items-center gap-4 mt-0.5">
                        <Typography variant="caption" color="gray">
                          Mã trường: {uni.universityCode}
                        </Typography>
                        <div className="w-1 h-1 rounded-full bg-neutral-300" />
                        <Typography variant="caption" color="gray">
                          {uni.totalStudents} học viên
                        </Typography>
                        <Badge
                          variant={
                            uni.status === "ACTIVE" ? "success" : "neutral"
                          }
                        >
                          {uni.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  <div className="flex gap-2">
                    <ActionButton
                      tooltipText={
                        uni.status === "ACTIVE"
                          ? "Tạm dừng hoạt động"
                          : "Kích hoạt hoạt động"
                      }
                      icon={uni.status === "ACTIVE" ? HiOutlineLockOpen : HiOutlineLockClosed}
                      color={uni.status === "ACTIVE" ? "amber" : "green"}
                      iconSize={20}
                      onClick={() =>
                        openConfirm({
                          title:
                            uni.status === "ACTIVE"
                              ? "Xác nhận tạm dừng"
                              : "Xác nhận kích hoạt",
                          message: `Bạn có chắc chắn muốn ${uni.status === "ACTIVE" ? "tạm dừng" : "kích hoạt"} trường "${uni.universityName}" không?`,
                          confirmText:
                            uni.status === "ACTIVE" ? "Tạm dừng" : "Kích hoạt",
                          variant:
                            uni.status === "ACTIVE" ? "danger" : "primary",
                          mutationKey: MUTATION_KEYS.TOGGLE_UNIVERSITY_STATUS,
                          onConfirm: () =>
                            toggleUniversityStatusMutation.mutate({
                              id: uni.id,
                              status: uni.status,
                            }),
                        })
                      }
                    />
                    <ActionButton
                      tooltipText="Chỉnh sửa"
                      icon={HiOutlinePencil}
                      color="blue"
                      iconSize={20}
                      onClick={() => handleOpenUpdateModal(uni)}
                    />
                    <ActionButton
                      tooltipText="Xóa trường"
                      icon={HiOutlineTrash}
                      color="red"
                      iconSize={20}
                      onClick={() =>
                        openConfirm({
                          title: "Xác nhận xóa",
                          message: `Bạn có chắc chắn muốn xóa trường "${uni.universityName}"? Toàn bộ dữ liệu cấp dưới sẽ bị xóa.`,
                          confirmText: "Xóa ngay",
                          variant: "danger",
                          mutationKey: MUTATION_KEYS.DELETE_UNIVERSITY,
                          onConfirm: () =>
                            deleteUniversityMutation.mutate(uni.id),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            {/* Sentinel for infinite scroll */}
            <div ref={setSentinelRef} className="h-1" />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-neutral-100 rounded-3xl text-neutral-300">
            <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-4">
              <HiOutlineOfficeBuilding size={40} className="opacity-20" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-black text-neutral-500 uppercase tracking-widest">
                Chưa có cơ sở đào tạo nào
              </p>
              <p className="text-sm font-medium italic text-neutral-400">
                Vui lòng bắt đầu bằng cách thêm trường đại học mới
              </p>
            </div>
          </div>
        )}
      </div>
      <div ref={setSentinelRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </PageContainer>
  );
}
