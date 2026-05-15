import { useQuery } from "@tanstack/react-query";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { organizationService } from "@/services/organizations";
import Skeleton from "@/library/Skeleton";
import ErrorState from "@/library/ErrorState";
import { EducationLevel } from "@/types/organizations";
import CreateEducationLevelForm from "./CreateEducationLevelForm";
import UpdateEducationLevelForm from "./UpdateEducationLevelForm";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useModalStore } from "@/store/useModalStore";
import Typography from "@/library/Typography";
import { HiOutlineAcademicCap, HiOutlinePencil, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import Tooltip from "@/library/Tooltip";
import Link from "next/link";
import useAppMutation from "@/hooks/useAppMutation";

interface OrganizationLevelsListProps {
  orgId: string;
  universityId: string;
}

export default function OrganizationLevelsList({ orgId, universityId }: OrganizationLevelsListProps) {
  const { openConfirm } = useConfirmStore();
  const { openModal } = useModalStore();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.EDUCATION_LEVELS, orgId],
    queryFn: () => organizationService.getEducationLevels({ organizationId: orgId }),
  });

  const deleteLevelMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.DELETE_EDUCATION_LEVEL,
    mutationFn: (id: string) => organizationService.deleteEducationLevel(id),
    invalidateQueryKey: [QUERY_KEYS.EDUCATION_LEVELS, orgId],
    successMessage: "Xóa trình độ thành công",
    errorMessage: "Xóa trình độ thất bại!",
    closeConfirmOnSuccess: true,
  });

  const handleOpenCreateLevelModal = (orgId: string) => {
    openModal({
      title: "Thêm trình độ mới",
      content: (
        <CreateEducationLevelForm organizationId={orgId} />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.CREATE_EDUCATION_LEVEL,
      },
    });
  }

  const handleOpenUpdateLevelModal = (orgId: string, level: EducationLevel) => {
    openModal({
      title: "Chỉnh sửa trình độ",
      content: (
        <UpdateEducationLevelForm level={level} organizationId={orgId} />
      ),
      size: "md",
      config: {
        mutationKey: MUTATION_KEYS.UPDATE_EDUCATION_LEVEL,
      },
    });
  }



  if (isLoading) {
    return (
      <div className="space-y-3 ml-4 border-l border-neutral-100 pl-4 mt-3">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <Skeleton width={150} height={16} />
            <div className="flex gap-2">
              <Skeleton width={32} height={32} />
              <Skeleton width={32} height={32} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ml-4 border-l border-neutral-100 pl-4 mt-3">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const levels = data?.data || [];

  return (
    <div className="space-y-4 mt-3 ml-4 border-l border-neutral-100 pl-4">
      {levels.map((level) => (
        <div key={level.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <Link href={`/commander/universities/${universityId}/${orgId}/${level.id}`}
              className="flex items-center gap-4 cursor-pointer group flex-1"
            >
              <div
                className="flex items-center gap-2 group">
                <HiOutlineAcademicCap size={18} className="text-secondary-500" />
                <Typography variant="body" weight="semibold" className="group-hover:text-primary-600 transition-colors">
                  Trình độ: {level.levelName}
                </Typography>
              </div>
            </Link>
            <div className="flex gap-2">
              <Tooltip content="Chỉnh sửa" position="top">
                <button
                  onClick={() => handleOpenUpdateLevelModal(orgId, level)}
                  className="cursor-pointer w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  <HiOutlinePencil size={14} />
                </button>
              </Tooltip>
              <Tooltip content="Xóa trình độ" position="top">
                <button
                  onClick={() =>
                    openConfirm({
                      title: "Xác nhận xóa",
                      message: `Xóa trình độ "${level.levelName}" và các lớp trực thuộc?`,
                      mutationKey: MUTATION_KEYS.DELETE_EDUCATION_LEVEL,
                      onConfirm: () => deleteLevelMutation.mutate(level.id),
                      variant: "danger",
                    })
                  }
                  className="cursor-pointer w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <HiOutlineTrash size={14} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => handleOpenCreateLevelModal(orgId)}
        className="ml-6 mt-2 flex items-center gap-2 text-neutral-500 hover:text-secondary-600 transition-colors cursor-pointer group"
      >
        <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-secondary-50 group-hover:text-secondary-600 transition-all">
          <HiOutlinePlus size={12} />
        </div>
        <Typography variant="caption" weight="semibold">
          Thêm trình độ
        </Typography>
      </button>
    </div>
  );
}
