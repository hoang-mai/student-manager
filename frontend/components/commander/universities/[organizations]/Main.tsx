"use client";

import { useState } from "react";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  HiOutlineHome,
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineCollection,
  HiOutlineClock,
  HiOutlineChevronDown,
  HiOutlineUserGroup,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
} from "react-icons/hi";

import Typography from "@/library/Typography";
import Button from "@/library/Button";
import Badge from "@/library/Badge";
import Skeleton from "@/library/Skeleton";
import Tooltip from "@/library/Tooltip";
import AnimatedContainer from "@/library/AnimatedContainer";
import ErrorState from "@/library/ErrorState";
import { useToastStore } from "@/store/useToastStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useModalStore } from "@/store/useModalStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { organizationService } from "@/services/organizations";
import { universityService } from "@/services/universities";
import { QUERY_KEYS } from "@/constants/query-keys";
import { DEFAULT_PAGE } from "@/constants/constants";
import { Organization } from "@/types/organizations";

import CreateOrganizationForm from "./CreateOrganizationForm";
import UpdateOrganizationForm from "./UpdateOrganizationForm";

import OrganizationLevelsList from "./education-level/OrganizationLevelsList";
import OrganizationSkeleton from "./OrganizationSkeleton";

interface Props {
  universityId: string;
}

export default function Main({ universityId }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { openConfirm, closeConfirm, setLoading } = useConfirmStore();
  const { openModal, closeModal } = useModalStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const {
    data: organizations,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.ORGANIZATIONS, universityId],
    queryFn: ({ pageParam }) =>
      organizationService.getOrganizations({
        universityId,
        page: pageParam,
        limit: DEFAULT_PAGE.PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const {
    data: universityData,
    isLoading: isUniversityLoading,
    isError: isUniversityError,
  } = useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITIES, universityId],
    queryFn: () => universityService.getUniversity(universityId),
    select: (res) => res.data,
  });

  const setSentinelRef = useInfiniteScroll({
    callback: fetchNextPage,
    hasNextPage,
    isFetching: isFetchingNextPage,
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: (id: string) => {
      setLoading(true);
      showLoading();
      return organizationService.deleteOrganization(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATIONS, universityId],
      });
      addToast({ message: "Xóa đơn vị thành công", variant: "success" });
      closeConfirm();
    },
    onError: (err: Error) => {
      addToast({
        message: err.message || "Xóa đơn vị thất bại!",
        variant: "error",
      });
    },
    onSettled: () => {
      setLoading(false);
      hideLoading();
    },
  });

  const toggleOrganizationStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "INACTIVE";
    }) => {
      setLoading(true);
      showLoading();
      return organizationService.toggleOrganizationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORGANIZATIONS, universityId],
      });
      addToast({
        message: "Cập nhật trạng thái thành công",
        variant: "success",
      });
      closeConfirm();
    },
    onError: (err: Error) => {
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

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreateOrgModal = () => {
    openModal({
      title: "Thêm chuyên ngành mới",
      content: (
        <CreateOrganizationForm
          universityId={universityId}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
      size: "md",
    });
  };

  const handleOpenUpdateOrgModal = (org: Organization) => {
    openModal({
      title: "Chỉnh sửa chuyên ngành",
      content: (
        <UpdateOrganizationForm
          organization={org}
          universityId={universityId}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      ),
      size: "md",
    });
  };

  if (isLoading || isUniversityLoading) {
    return <OrganizationSkeleton />;
  }

  if (isError || isUniversityError) {
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
        <Link
          href="/commander/universities"
          className="hover:text-primary-600 transition-colors"
        >
          <Typography variant="label" tracking="wide">
            Cơ sở đào tạo
          </Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">
          {universityData?.universityName}
        </Typography>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          {isUniversityLoading ? (
            <Skeleton width={400} height={32} />
          ) : (
            <Typography variant="h1" transform="uppercase">
              {`Ngành đào tạo - ${universityData?.universityName}`}
            </Typography>
          )}
          <Typography variant="body" color="gray" className="mt-1">
            Quản lý các chuyên ngành và đơn vị trực thuộc trường
          </Typography>
        </div>
        <Button
          onClick={() => handleOpenCreateOrgModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-primary-600 rounded-xl text-[11px]! font-black! uppercase tracking-wider text-white hover:bg-primary-700 hover:border-primary-700 transition-all shadow-lg shadow-primary-600/20 cursor-pointer active:scale-95 h-auto"
          icon={HiOutlinePlus}
        >
          Thêm chuyên ngành / Đơn vị
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {organizations && organizations.length > 0 ? (
          <div className="grid gap-4">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white border border-neutral-100 rounded-2xl p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex flex-1 items-center gap-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(org.id);
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600">
                      <HiOutlineCollection size={24} />
                    </div>
                    <div>
                      <Typography variant="h3" weight="bold">
                        {org.organizationName}
                      </Typography>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-neutral-400">
                          <HiOutlineClock size={14} />
                          <Typography variant="caption">
                            Di chuyển: {org.travelTime} phút
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <HiOutlineUserGroup size={14} />
                          <Typography variant="caption">
                            {org.totalStudents} học viên
                          </Typography>
                        </div>
                        <Badge
                          variant={
                            org.status === "ACTIVE" ? "success" : "neutral"
                          }
                        >
                          {org.status === "ACTIVE" ? "Hoạt động" : "Tạm dừng"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Tooltip
                      content={
                        org.status === "ACTIVE"
                          ? "Tạm dừng hoạt động"
                          : "Kích hoạt hoạt động"
                      }
                      position="top"
                    >
                      <button
                        onClick={() =>
                          openConfirm({
                            title:
                              org.status === "ACTIVE"
                                ? "Xác nhận tạm dừng"
                                : "Xác nhận kích hoạt",
                            message: `Bạn có chắc chắn muốn ${org.status === "ACTIVE" ? "tạm dừng" : "kích hoạt"} đơn vị "${org.organizationName}" không?`,
                            confirmText:
                              org.status === "ACTIVE"
                                ? "Tạm dừng"
                                : "Kích hoạt",
                            variant:
                              org.status === "ACTIVE" ? "danger" : "primary",
                            onConfirm: () =>
                              toggleOrganizationStatusMutation.mutate({
                                id: org.id,
                                status: org.status,
                              }),
                          })
                        }
                        className={`cursor-pointer w-9 h-9 flex items-center justify-center transition-all rounded-xl text-neutral-400 ${
                          org.status === "ACTIVE"
                            ? "hover:bg-amber-50 hover:text-amber-600"
                            : "hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                      >
                        {org.status === "ACTIVE" ? (
                          <HiOutlineLockOpen size={18} />
                        ) : (
                          <HiOutlineLockClosed size={18} />
                        )}
                      </button>
                    </Tooltip>
                    <Tooltip content="Chỉnh sửa" position="top">
                      <button
                        onClick={() => handleOpenUpdateOrgModal(org)}
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Xóa đơn vị" position="top">
                      <button
                        onClick={() =>
                          openConfirm({
                            title: "Xác nhận xóa",
                            message: `Xóa đơn vị "${org.organizationName}"?`,
                            onConfirm: () =>
                              deleteOrganizationMutation.mutate(org.id),
                            variant: "danger",
                          })
                        }
                        className="cursor-pointer w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </Tooltip>
                    <Tooltip content="Xem trình độ đào tạo" position="top">
                      <button
                        onClick={() => {
                          toggleExpand(org.id);
                        }}
                        className={`cursor-pointer w-9 h-9 flex items-center justify-center rounded-xl transition-all ${expandedIds.includes(org.id) ? "bg-primary-50 text-primary-600" : "text-neutral-400 hover:bg-neutral-50"}`}
                      >
                        <HiOutlineChevronDown
                          size={18}
                          className={`transition-transform ${expandedIds.includes(org.id) ? "rotate-180" : ""}`}
                        />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedIds.includes(org.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-neutral-50">
                        <OrganizationLevelsList
                          orgId={org.id}
                          universityId={universityId}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={setSentinelRef} className="h-1" />
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
            <Typography color="gray">
              Chưa có chuyên ngành / đơn vị nào
            </Typography>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}
