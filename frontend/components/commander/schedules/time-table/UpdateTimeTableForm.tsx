"use client";

import { useMemo } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineCalendar } from "react-icons/hi";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import Input from "@/library/Input";
import Select from "@/library/Select";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import useAppMutation from "@/hooks/useAppMutation";
import { useModalStore } from "@/store/useModalStore";
import { semesterService } from "@/services/semesters";
import { timeTableService } from "@/services/time-tables";
import { TimeTable } from "@/types/time-tables";
import {
  updateTimeTableSchema,
  UpdateTimeTableFormValues,
} from "@/utils/validations";
import TimeTableCalendarForm, { emptySchedule } from "./TimeTableCalendarForm";

const toFormSchedules = (schedules: TimeTable["schedules"]) =>
  schedules?.map((schedule) => ({
    day: schedule.day,
    room: schedule.room,
    subjectName: schedule.subjectName,
    week: schedule.week,
    timeRange: {
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    },
  })) || [];

export default function UpdateTimeTableForm({
  timeTable,
}: {
  timeTable: TimeTable;
}) {
  const { closeModal } = useModalStore();
  const { data: semestersResponse, isLoading: isLoadingSemesters } = useQuery({
    queryKey: [QUERY_KEYS.SEMESTERS, "time-table-options"],
    queryFn: () => semesterService.getSemesters({ fetchAll: true }),
  });

  const semesterOptions = useMemo(
    () =>
      (semestersResponse?.data || []).map((semester) => {
        const schoolYear = semester.schoolYearInfo?.schoolYear || "";

        return {
          value: semester.id,
          label: `${schoolYear} - Học kỳ ${String(semester.code)}`,
        };
      }),
    [semestersResponse]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateTimeTableFormValues>({
    resolver: zodResolver(updateTimeTableSchema),
    defaultValues: {
      userId: timeTable.userId,
      semesterId: timeTable.semesterId || "",
      schedules: timeTable.schedules?.length
        ? toFormSchedules(timeTable.schedules)
        : [emptySchedule],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.UPDATE_TIME_TABLE,
    mutationFn: (data: UpdateTimeTableFormValues) =>
      timeTableService.updateTimeTable(timeTable.id, data),
    invalidateQueryKey: [QUERY_KEYS.TIME_TABLES],
    successMessage: "Cập nhật lịch học thành công!",
    errorMessage: "Cập nhật lịch học thất bại!",
    onSuccess: () => closeModal(),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="max-h-[85vh] space-y-6 overflow-y-auto py-2 pr-2"
    >
      <Input
        label="ID tài khoản học viên"
        prefixIcon={<HiOutlineCalendar />}
        error={errors.userId?.message}
        isLoading={mutation.isPending}
        {...register("userId")}
        required
      />

      <Controller
        name="semesterId"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Học kỳ"
            placeholder="Chọn học kỳ"
            prefixIcon={<HiOutlineCalendar />}
            value={value}
            onChange={(selectedValue) => onChange(String(selectedValue))}
            options={semesterOptions}
            isLoading={mutation.isPending || isLoadingSemesters}
            error={errors.semesterId?.message}
            emptyText="Chưa có học kỳ"
            required
          />
        )}
      />

      <TimeTableCalendarForm
        control={control}
        fields={fields}
        register={register}
        errors={errors}
        append={append}
        remove={remove}
      />

      <Divide />
      <div className="flex justify-end gap-3 px-4">
        <Button
          variant="ghost"
          type="button"
          onClick={closeModal}
          isLoading={mutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={!isDirty}
          isLoading={mutation.isPending}
        >
          Cập nhật
        </Button>
      </div>
    </form>
  );
}
