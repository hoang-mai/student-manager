"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createClassSchema, CreateClassFormValues } from "@/utils/validations";
import { classService } from "@/services/classes";
import { universityService } from "@/services/universities";
import { organizationService } from "@/services/organizations";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import Select from "@/library/Select";
import { useToastStore } from "@/store/useToastStore";
import Divide from "@/library/Divide";
import { useLoadingStore } from "@/store/useLoadingStore";
import {
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineAcademicCap,
  HiOutlineTag,
} from "react-icons/hi";
import { DEFAULT_PAGE } from "@/constants/constants";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateClassForm({ onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const [selectedUniversityId, setSelectedUniversityId] = useState<string>("");
  const [selectedOrganizationId, setSelectedOrganizationId] =
    useState<string>("");

  const {
    data: universitiesData,
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
    data: organizationsData,
    fetchNextPage: fetchNextOrgs,
    hasNextPage: hasNextOrgs,
    isFetchingNextPage: isFetchingNextOrgs,
    isLoading: isLoadingOrgs,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.ORGANIZATIONS, selectedUniversityId],
    queryFn: ({ pageParam }) =>
      organizationService.getOrganizations({
        universityId: selectedUniversityId,
        page: pageParam,
        limit: DEFAULT_PAGE.PAGE_SIZE,
      }),
    initialPageParam: DEFAULT_PAGE.PAGE_INDEX + 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!selectedUniversityId,
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const {
    data: levelsData,
    fetchNextPage: fetchNextLevels,
    hasNextPage: hasNextLevels,
    isFetchingNextPage: isFetchingNextLevels,
    isLoading: isLoadingLevels,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.EDUCATION_LEVELS, selectedOrganizationId],
    queryFn: ({ pageParam }) =>
      organizationService.getEducationLevels({
        organizationId: selectedOrganizationId,
        page: pageParam,
        limit: DEFAULT_PAGE.PAGE_SIZE,
      }),
    initialPageParam: DEFAULT_PAGE.PAGE_INDEX + 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!selectedOrganizationId,
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: "",
      studentCount: 0,
      educationLevelId: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateClassFormValues) => {
      showLoading();
      return classService.createClass(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES] });
      addToast({
        message: "Thêm lớp học thành công!",
        variant: "success",
      });
      onSuccess();
    },
    onError: (err) => {
      addToast({
        message: err.message || "Đã có lỗi xảy ra!",
        variant: "error",
      });
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const universityOptions =
    universitiesData?.map((uni) => ({
      value: uni.id,
      label: uni.universityName,
    })) || [];

  const organizationOptions =
    organizationsData?.map((org) => ({
      value: org.id,
      label: org.organizationName,
    })) || [];

  const levelOptions =
    levelsData?.map((level) => ({
      value: level.id,
      label: level.levelName,
    })) || [];

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6 py-2"
    >
      {/* Chọn Trường đại học */}
      <div className="relative z-30">
        <Select
          label="Chọn trường đại học"
          required
          placeholder="Chọn trường đại học..."
          prefixIcon={<HiOutlineOfficeBuilding size={16} />}
          options={universityOptions}
          value={selectedUniversityId}
          onChange={(val) => {
            setSelectedUniversityId(String(val));
            setSelectedOrganizationId("");
            setValue("educationLevelId", "");
          }}
          hasNextPage={hasNextUniversities}
          isFetchingNextPage={isFetchingNextUniversities}
          onLoadMore={fetchNextUniversities}
          isLoading={isLoadingUniversities}
        />
      </div>

      {/* Chọn Khoa/Ngành */}
      <div className="relative z-20">
        <Select
          label="Chọn khoa/ngành"
          required
          placeholder={"Chọn khoa/ngành..."}
          prefixIcon={<HiOutlineTag size={16} />}
          options={organizationOptions}
          value={selectedOrganizationId}
          onChange={(val) => {
            setSelectedOrganizationId(String(val));
            setValue("educationLevelId", "");
          }}
          disabled={!selectedUniversityId}
          hasNextPage={hasNextOrgs}
          isFetchingNextPage={isFetchingNextOrgs}
          onLoadMore={fetchNextOrgs}
          isLoading={isLoadingOrgs}
        />
      </div>

      {/* Chọn Bậc đào tạo */}
      <div className="relative z-10">
        <Controller
          control={control}
          name="educationLevelId"
          render={({ field: { value, onChange } }) => (
            <div>
              <Select
                label="Chọn bậc đào tạo"
                required
                placeholder={"Chọn bậc đào tạo..."}
                prefixIcon={<HiOutlineAcademicCap size={16} />}
                options={levelOptions}
                value={value}
                onChange={(val) => onChange(String(val))}
                disabled={!selectedOrganizationId}
                error={errors.educationLevelId?.message}
                hasNextPage={hasNextLevels}
                isFetchingNextPage={isFetchingNextLevels}
                onLoadMore={fetchNextLevels}
                isLoading={isLoadingLevels}
              />
            </div>
          )}
        />
      </div>

      {/* Tên lớp học */}
      <Input
        label="Tên lớp học"
        placeholder="VD: CNTT-K60, AT15..."
        prefixIcon={<HiOutlineUserGroup />}
        error={errors.className?.message}
        {...register("className")}
        required
      />

      {/* Số lượng học viên */}
      <Input
        label="Số lượng học viên"
        type="number"
        placeholder="Nhập số lượng học viên hiện tại..."
        prefixIcon={<HiOutlineUserGroup />}
        error={errors.studentCount?.message}
        {...register("studentCount", { valueAsNumber: true })}
        required
      />

      <div className="flex flex-col gap-4">
        <Divide />
        <div className="flex items-center justify-end gap-3 px-4">
          <Button
            variant="ghost"
            type="button"
            onClick={onCancel}
            isLoading={mutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Thêm mới
          </Button>
        </div>
      </div>
    </form>
  );
}
