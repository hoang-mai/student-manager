"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/library/Button";
import Input from "@/library/Input";
import DatePicker from "@/library/DatePicker";
import Select from "@/library/Select";
import { RANKS } from "@/constants/constants";
import { DutySchedule } from "@/types/duty-schedules";
import { dutyScheduleService } from "@/services/duty-schedules";
import { dutyScheduleSchema, DutyScheduleFormValues } from "@/utils/validations";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import useAppMutation from "@/hooks/useAppMutation";
import { useModalStore } from "@/store/useModalStore";

interface UpdateDutyScheduleFormProps {
  schedule: DutySchedule;
}

export default function UpdateDutyScheduleForm({
  schedule,
}: UpdateDutyScheduleFormProps) {
  const { closeModal } = useModalStore();

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.UPDATE_DUTY_SCHEDULE,
    mutationFn: (data: DutyScheduleFormValues) =>
      dutyScheduleService.updateDutySchedule(schedule.id, data),
    invalidateQueryKey: [QUERY_KEYS.DUTY_SCHEDULES],
    successMessage: "Cập nhật thành công!",
    errorMessage: "Cập nhật thất bại!",
    onSuccess: () => closeModal(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DutyScheduleFormValues>({
    resolver: zodResolver(dutyScheduleSchema),
    defaultValues: {
      fullName: schedule.fullName,
      rank: schedule.rank,
      phoneNumber: schedule.phoneNumber,
      position: schedule.position,
      workDay: schedule.workDay,
    },
  });

  const onSubmit: SubmitHandler<DutyScheduleFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
      <Input
        label="Họ và tên"
        placeholder="Nhập họ và tên người trực"
        {...register("fullName")}
        error={errors.fullName?.message}
        required
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
          Cập nhật
        </Button>
      </div>
    </form>
  );
}
