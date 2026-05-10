"use client";

import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  HiOutlineHome,
  HiOutlineChevronRight,
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
import { useToastStore } from "@/store/useToastStore";
import Badge from "@/library/Badge";
import Skeleton from "@/library/Skeleton";
import Tooltip from "@/library/Tooltip";
import AnimatedContainer from "@/library/AnimatedContainer";
import ErrorState from "@/library/ErrorState";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { universityService } from "@/services/universities";
import { QUERY_KEYS } from "@/constants/query-keys";
import { DEFAULT_PAGE } from "@/constants/constants";
import { University } from "@/types/universities";

import CreateUniversityForm from "./CreateUniversityForm";
import UpdateUniversityForm from "./UpdateUniversityForm";
import Typography from "@/library/Typography";
import Button from "@/library/Button";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function Main() {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const { openConfirm, closeConfirm, setLoading } = useConfirmStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const { addToast } = useToastStore();

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

  useInfiniteScroll({
    callback: fetchNextPage,
    hasNextPage,
    isFetching: isFetchingNextPage,
  });

  const toggleUniversityStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => {
      setLoading(true);
      showLoading();
      return universityService.toggleUniversityStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITIES] });
      addToast({
        message: "Cập nhật trạng thái thành công",
        variant: "success",
      });
      closeConfirm();
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
  });

  const deleteUniversityMutation = useMutation({
    mutationFn: (id: string) => {
      setLoading(true);
      showLoading();
      return universityService.deleteUniversity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITIES] });
      addToast({
        message: "Xóa trường đại học thành công",
        variant: "success",
      });
      closeConfirm();
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
  });

  const handleOpenCreateModal = () => {
    openModal({
      title: "Thêm trường đại học",
      content: (
        <CreateUniversityForm onSuccess={closeModal} onCancel={closeModal} />
      ),
      size: "md",
    });
  };

  const handleOpenUpdateModal = (uni: University) => {
    openModal({
      title: "Chỉnh sửa trường đại học",
      content: (
        <UpdateUniversityForm
          university={uni}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
      size: "md",
    });
  };

  if (isLoading) {
    return <UniversitySkeleton />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <AnimatedContainer
      variant="slideUp"
      className="space-y-8 rounded-2xl bg-white p-6 min-h-screen"
    >
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
          Cơ sở đào tạo
        </Typography>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Typography variant="h1" transform="uppercase">
          Quản lý cơ sở đào tạo
        </Typography>
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
          universities.map((uni) => (
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
                  <Tooltip
                    content={
                      uni.status === "ACTIVE"
                        ? "Tạm dừng hoạt động"
                        : "Kích hoạt hoạt động"
                    }
                    position="top"
                  >
                    <button
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
                          onConfirm: () =>
                            toggleUniversityStatusMutation.mutate({
                              id: uni.id,
                              status: uni.status,
                            }),
                        })
                      }
                      className={`cursor-pointer w-9 h-9 flex items-center justify-center transition-all rounded-xl text-neutral-400 ${
                        uni.status === "ACTIVE"
                          ? "hover:bg-amber-50 hover:text-amber-600"
                          : "hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      {uni.status === "ACTIVE" ? (
                        <HiOutlineLockOpen size={20} />
                      ) : (
                        <HiOutlineLockClosed size={20} />
                      )}
                    </button>
                  </Tooltip>
                  <Tooltip content="Chỉnh sửa" position="top">
                    <button
                      onClick={() => handleOpenUpdateModal(uni)}
                      className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <HiOutlinePencil size={20} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Xóa trường" position="top">
                    <button
                      onClick={() =>
                        openConfirm({
                          title: "Xác nhận xóa",
                          message: `Bạn có chắc chắn muốn xóa trường "${uni.universityName}"? Toàn bộ dữ liệu cấp dưới sẽ bị xóa.`,
                          confirmText: "Xóa ngay",
                          variant: "danger",
                          onConfirm: () =>
                            deleteUniversityMutation.mutate(uni.id),
                        })
                      }
                      className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))
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

        {/* Loading trigger for infinite scroll */}
        {(hasNextPage || isFetchingNextPage) && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}
