"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingUnitService, University, Organization, EducationLevel, Class } from "@/services/training-unit";
import { QUERY_KEYS } from "@/constants/query-keys";
import AnimatedContainer from "@/library/AnimatedContainer";
import Typography from "@/library/Typography";
import {
  HiOutlineOfficeBuilding,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineChevronDown,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineUserGroup,
  HiOutlineClock
} from "react-icons/hi";
import Link from "next/link";
import { useModalStore } from "@/store/useModalStore";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useToastStore } from "@/store/useToastStore";
import Badge from "@/library/Badge";
import Tooltip from "@/library/Tooltip";

import UniversityForm from "./UniversityForm";
import OrganizationForm from "./OrganizationForm";
import EducationLevelForm from "./EducationLevelForm";
import ClassForm from "./ClassForm";

export default function Main() {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const { openConfirm, closeConfirm } = useConfirmStore();
  const { addToast } = useToastStore();

  const { data: hierarchy, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY],
    queryFn: () => trainingUnitService.getUniversityHierarchy(),
    select: (res) => res.data,
  });

  const deleteUniversityMutation = useMutation({
    mutationFn: (id: string) => trainingUnitService.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({ message: "Xóa trường thành công", variant: "success" });
      closeConfirm();
    },
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: (id: string) => trainingUnitService.deleteOrganization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({ message: "Xóa đơn vị thành công", variant: "success" });
      closeConfirm();
    },
  });

  const deleteLevelMutation = useMutation({
    mutationFn: (id: string) => trainingUnitService.deleteEducationLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({ message: "Xóa trình độ thành công", variant: "success" });
      closeConfirm();
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => trainingUnitService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({ message: "Xóa lớp học thành công", variant: "success" });
      closeConfirm();
    },
  });

  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleOpenUniversityModal = (university?: University) => {
    openModal({
      title: university ? "Chỉnh sửa trường đại học" : "Thêm trường đại học mới",
      content: <UniversityForm university={university} onSuccess={closeModal} onCancel={closeModal} />,
      size: "md",
    });
  };

  const handleOpenOrganizationModal = (universityId: string, organization?: Organization) => {
    openModal({
      title: organization ? "Chỉnh sửa đơn vị / chuyên ngành" : "Thêm đơn vị / chuyên ngành mới",
      content: <OrganizationForm universityId={universityId} organization={organization} onSuccess={closeModal} onCancel={closeModal} />,
      size: "md",
    });
  };

  const handleOpenLevelModal = (organizationId: string, level?: EducationLevel) => {
    openModal({
      title: level ? "Chỉnh sửa trình độ đào tạo" : "Thêm trình độ đào tạo mới",
      content: <EducationLevelForm organizationId={organizationId} level={level} onSuccess={closeModal} onCancel={closeModal} />,
      size: "md",
    });
  };

  const handleOpenClassModal = (educationLevelId: string, cls?: Class) => {
    openModal({
      title: cls ? "Chỉnh sửa lớp học" : "Thêm lớp học mới",
      content: <ClassForm educationLevelId={educationLevelId} cls={cls} onSuccess={closeModal} onCancel={closeModal} />,
      size: "md",
    });
  };

  const renderClasses = (levelId: string, classes: Class[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
      {classes.map(cls => (
        <div key={cls.id} className="p-3 bg-neutral-50/50 border border-neutral-100 rounded-xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm">
              <HiOutlineUserGroup size={16} />
            </div>
            <div>
              <Typography variant="body" weight="semibold">{cls.className}</Typography>
              <Typography variant="caption" color="gray">{cls.studentCount} học viên</Typography>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <button
              onClick={() => handleOpenClassModal(levelId, cls)}
              className="p-1.5 hover:text-blue-600 rounded-md transition-colors"
            >
              <HiOutlinePencil size={14} />
            </button>
            <button
              onClick={() => openConfirm({
                title: "Xác nhận xóa",
                message: `Xóa lớp "${cls.className}"?`,
                onConfirm: () => deleteClassMutation.mutate(cls.id),
                variant: "danger"
              })}
              className="p-1.5 hover:text-red-600 rounded-md transition-colors"
            >
              <HiOutlineTrash size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => handleOpenClassModal(levelId)}
        className="p-3 border border-dashed border-neutral-200 rounded-xl flex items-center justify-center gap-2 text-neutral-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all"
      >
        <HiOutlinePlus size={16} />
        <Typography variant="caption" weight="semibold">Thêm lớp học</Typography>
      </button>
    </div>
  );

  const renderLevels = (orgId: string, levels: EducationLevel[]) => (
    <div className="space-y-4 mt-3 ml-4 border-l border-neutral-100 pl-4">
      {levels.map(level => (
        <div key={level.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleExpand(level.id)}>
              <div className={`transition-transform duration-300 ${expandedIds.includes(level.id) ? 'rotate-180' : ''}`}>
                <HiOutlineChevronDown size={14} className="text-neutral-400" />
              </div>
              <HiOutlineAcademicCap size={18} className="text-secondary-500" />
              <Typography variant="body" weight="semibold" className="group-hover:text-primary-600 transition-colors">
                Trình độ: {level.levelName}
              </Typography>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenLevelModal(orgId, level)}
                className="p-1.5 hover:text-blue-600 rounded-md transition-colors"
              >
                <HiOutlinePencil size={14} />
              </button>
              <button
                onClick={() => openConfirm({
                  title: "Xác nhận xóa",
                  message: `Xóa trình độ "${level.levelName}" và các lớp trực thuộc?`,
                  onConfirm: () => deleteLevelMutation.mutate(level.id),
                  variant: "danger"
                })}
                className="p-1.5 hover:text-red-600 rounded-md transition-colors"
              >
                <HiOutlineTrash size={14} />
              </button>
            </div>
          </div>
          {expandedIds.includes(level.id) && renderClasses(level.id, level.classes || [])}
        </div>
      ))}
      <button
        onClick={() => handleOpenLevelModal(orgId)}
        className="flex items-center gap-2 text-neutral-400 hover:text-primary-600 transition-colors ml-6"
      >
        <HiOutlinePlus size={14} />
        <Typography variant="caption" weight="semibold">Thêm trình độ</Typography>
      </button>
    </div>
  );

  const renderOrganizations = (uniId: string, orgs: Organization[]) => (
    <div className="space-y-6 mt-4 ml-4 border-l-2 border-primary-50 pl-6">
      {orgs.map(org => (
        <div key={org.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleExpand(org.id)}>
              <div className={`transition-transform duration-300 ${expandedIds.includes(org.id) ? 'rotate-180' : ''}`}>
                <HiOutlineChevronDown size={16} className="text-neutral-400" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600">
                <HiOutlineCollection size={20} />
              </div>
              <div>
                <Typography variant="h3" className="group-hover:text-primary-600 transition-colors">
                  {org.organizationName}
                </Typography>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-neutral-400">
                    <HiOutlineClock size={12} />
                    <Typography variant="caption">Di chuyển: {org.travelTime} phút</Typography>
                  </div>
                  <Badge variant={org.status === 'ACTIVE' ? 'success' : 'neutral'}>
                    {org.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenOrganizationModal(uniId, org)}
                className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
              >
                <HiOutlinePencil size={18} />
              </button>
              <button
                onClick={() => openConfirm({
                  title: "Xác nhận xóa",
                  message: `Xóa đơn vị "${org.organizationName}"?`,
                  onConfirm: () => deleteOrganizationMutation.mutate(org.id),
                  variant: "danger"
                })}
                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
              >
                <HiOutlineTrash size={18} />
              </button>
            </div>
          </div>
          {expandedIds.includes(org.id) && renderLevels(org.id, org.educationLevels || [])}
        </div>
      ))}
      <button
        onClick={() => handleOpenOrganizationModal(uniId)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary-50 text-secondary-600 rounded-xl hover:bg-secondary-100 transition-all ml-8"
      >
        <HiOutlinePlus size={18} />
        <Typography variant="body" weight="semibold">Thêm chuyên ngành / Đơn vị</Typography>
      </button>
    </div>
  );

  return (
    <AnimatedContainer variant="slideUp" className="space-y-8 relative rounded-2xl bg-white p-6 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-neutral-400">
        <Link href="/commander" className="flex items-center gap-2 hover:text-primary-600 transition-colors group">
          <HiOutlineHome size={14} className="mb-0.5 group-hover:scale-110 transition-transform" />
          <Typography variant="label" tracking="wide">Tổng quan</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">Cơ sở đào tạo</Typography>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Typography variant="h1" transform="uppercase">Quản lý cơ sở đào tạo</Typography>
        <button
          onClick={() => handleOpenUniversityModal()}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 transition-all"
        >
          <HiOutlinePlus size={20} />
          <Typography variant="body" weight="semibold">Thêm trường đại học</Typography>
        </button>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          hierarchy?.map((uni) => (
            <div key={uni.id} className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-6 bg-gradient-to-r from-neutral-50/50 to-white flex items-center justify-between border-b border-neutral-50">
                <div className="flex items-center gap-4 cursor-pointer group" onClick={() => toggleExpand(uni.id)}>
                  <div className={`transition-transform duration-300 ${expandedIds.includes(uni.id) ? 'rotate-180' : ''}`}>
                    <HiOutlineChevronDown size={20} className="text-neutral-400" />
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                    <HiOutlineOfficeBuilding size={24} />
                  </div>
                  <div>
                    <Typography variant="h3" className="group-hover:text-primary-600 transition-colors">
                      {uni.universityName}
                    </Typography>
                    <div className="flex items-center gap-4 mt-0.5">
                      <Typography variant="caption" color="gray">Mã trường: {uni.universityCode}</Typography>
                      <div className="w-1 h-1 rounded-full bg-neutral-300" />
                      <Typography variant="caption" color="gray">{uni.totalStudents} học viên</Typography>
                      <Badge variant={uni.status === 'ACTIVE' ? 'success' : 'neutral'}>
                        {uni.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Chỉnh sửa">
                    <button
                      onClick={() => handleOpenUniversityModal(uni)}
                      className="p-2.5 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border border-transparent hover:border-blue-100"
                    >
                      <HiOutlinePencil size={20} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Xóa trường">
                    <button
                      onClick={() => openConfirm({
                        title: "Xác nhận xóa",
                        message: `Bạn có chắc chắn muốn xóa trường "${uni.universityName}"? Toàn bộ dữ liệu cấp dưới sẽ bị xóa.`,
                        confirmText: "Xóa ngay",
                        variant: "danger",
                        onConfirm: () => deleteUniversityMutation.mutate(uni.id)
                      })}
                      className="p-2.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                      <HiOutlineTrash size={20} />
                    </button>
                  </Tooltip>
                </div>
              </div>
              {expandedIds.includes(uni.id) && (
                <div className="p-6 pt-0">
                  {renderOrganizations(uni.id, uni.organizations || [])}
                </div>
              )}
            </div>
          ))
        )}

        {!isLoading && hierarchy?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-100">
            <HiOutlineOfficeBuilding size={64} className="text-neutral-200" />
            <Typography variant="h3" color="gray" className="mt-4">Chưa có cơ sở đào tạo nào</Typography>
            <Typography variant="body" color="gray" className="mt-1">Bắt đầu bằng cách thêm trường đại học mới</Typography>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}
