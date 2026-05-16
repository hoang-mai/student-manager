"use client";

import React, { useMemo, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "@/library/Button";
import Input from "@/library/Input";
import DatePicker from "@/library/DatePicker";
import Select from "@/library/Select";
import { RANKS, DEFAULT_PAGE, ROLES } from "@/constants/constants";
import { ENDPOINTS } from "@/constants/endpoints";
import { dutyScheduleService } from "@/services/duty-schedules";
import { userService } from "@/services/user";
import { dutyScheduleSchema, DutyScheduleFormValues } from "@/utils/validations";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import useAppMutation from "@/hooks/useAppMutation";
import { useModalStore } from "@/store/useModalStore";

export default function CreateDutyScheduleForm() {
  const { closeModal } = useModalStore();
  const [selectedCommanderId, setSelectedCommanderId] = useState<string>("");

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.CREATE_DUTY_SCHEDULE,
    mutationFn: (data: DutyScheduleFormValues) =>
      dutyScheduleService.createDutySchedule(data),
    invalidateQueryKey: [QUERY_KEYS.DUTY_SCHEDULES],
    successMessage: "Phân công thành công!",
    errorMessage: "Phân công thất bại!",
    onSuccess: () => closeModal(),
  });

  const {
    data: commandersData,
    fetchNextPage: fetchNextCommanders,
    hasNextPage: hasNextCommanders,
    isFetchingNextPage: isFetchingNextCommanders,
    isLoading: isLoadingCommanders,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.USERS, "commanders"],
    queryFn: ({ pageParam }) =>
      userService.getAllUsers(
        {
          page: pageParam,
          limit: DEFAULT_PAGE.PAGE_SIZE,
          role: ROLES.COMMANDER.role,
        },
      ),
    initialPageParam: DEFAULT_PAGE.PAGE_INDEX + 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const commanderOptions = useMemo(
    () =>
      commandersData?.map((commander) => ({
        value: commander.id,
        label: commander.profile?.fullName || commander.username,
      })) || [],
    [commandersData]
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DutyScheduleFormValues>({
    resolver: zodResolver(dutyScheduleSchema),
    defaultValues: {
      fullName: "",
      rank: "",
      phoneNumber: "",
      position: "",
      workDay: "",
    },
  });

  const onSubmit: SubmitHandler<DutyScheduleFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <Select
            label="Họ và tên"
            placeholder="Chọn chỉ huy trực"
            value={selectedCommanderId}
            onChange={(value) => {
              const commanderId = String(value);
              const commander = commandersData?.find(
                (item) => String(item.id) === commanderId
              );

              setSelectedCommanderId(commanderId);
              field.onChange(commander?.profile?.fullName || commander?.username || "");
              setValue("rank", commander?.profile?.rank || "");
              setValue("phoneNumber", commander?.profile?.phoneNumber || "");
            }}
            options={commanderOptions}
            hasNextPage={hasNextCommanders}
            isFetchingNextPage={isFetchingNextCommanders}
            onLoadMore={fetchNextCommanders}
            isLoading={isLoadingCommanders}
            error={errors.fullName?.message}
            emptyText="Không tìm thấy chỉ huy"
            required
          />
        )}
      />

      <Controller
        name="rank"
        control={control}
        render={({ field }) => (
          <Select
            label="Cấp bậc"
            placeholder="Chọn cấp bậc"
            value={field.value}
            onChange={field.onChange}
            options={Object.values(RANKS).map((rank) => ({ value: rank, label: rank }))}
            error={errors.rank?.message}
            required
          />
        )}
      />

      <Input
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        {...register("phoneNumber")}
        error={errors.phoneNumber?.message}
        required
      />

      <Input
        label="Nhiệm vụ / Ca trực"
        placeholder="Ví dụ: Trực ban d, Trực ban c..."
        {...register("position")}
        error={errors.position?.message}
        required
      />

      <Controller
        name="workDay"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Ngày trực"
            placeholder="Chọn ngày trực"
            value={field.value}
            onChange={field.onChange}
            error={errors.workDay?.message}
            required
          />
        )}
      />

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" type="button" onClick={closeModal}>
          Hủy
        </Button>
        <Button variant="primary" type="submit" isLoading={mutation.isPending}>
          Phân công
        </Button>
      </div>
    </form>
  );
}
