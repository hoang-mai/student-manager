"use client";

import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HiOutlineAcademicCap } from "react-icons/hi";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import Select from "@/library/Select";
import { DEFAULT_PAGE, ROLES } from "@/constants/constants";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import useAppMutation from "@/hooks/useAppMutation";
import { useDebounce } from "@/hooks/useDebounce";
import { userService } from "@/services/user";
import { useModalStore } from "@/store/useModalStore";
import { timeTableService } from "@/services/time-tables";
import {
  createTimeTableSchema,
  CreateTimeTableFormValues,
} from "@/utils/validations";
import TimeTableCalendarForm, { emptySchedule } from "./TimeTableCalendarForm";
import { isDirty } from "zod/v3";

export default function CreateTimeTableForm() {
  const { closeModal } = useModalStore();
  const [studentSearch, setStudentSearch] = useState("");
  const debouncedSearch = useDebounce(studentSearch);

  const {
    data: studentsData,
    fetchNextPage: fetchNextStudents,
    hasNextPage: hasNextStudents,
    isFetchingNextPage: isFetchingNextStudents,
    isLoading: isLoadingStudents,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.USERS, ROLES.STUDENT.ROLE, debouncedSearch],
    queryFn: ({ pageParam }) =>
      userService.getAllUsers({
        page: pageParam,
        limit: DEFAULT_PAGE.PAGE_SIZE,
        role: ROLES.STUDENT.ROLE,
        fullName: debouncedSearch || undefined,
      }),
    initialPageParam: DEFAULT_PAGE.PAGE_INDEX + 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    select: (data) => data.pages.flatMap((page) => page.data || []),
  });

  const studentOptions = useMemo(
    () =>
      studentsData?.map((student) => ({
        value: student.id,
        label: student.profile?.code
          ? `${student.profile?.fullName || student.username} - ${student.profile.code}`
          : student.profile?.fullName || student.username,
      })) || [],
    [studentsData]
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateTimeTableFormValues>({
    resolver: zodResolver(createTimeTableSchema),
    defaultValues: {
      userId: "",
      schedules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.CREATE_TIME_TABLE,
    mutationFn: (data: CreateTimeTableFormValues) =>
      timeTableService.createTimeTable(data),
    invalidateQueryKey: [QUERY_KEYS.TIME_TABLES],
    successMessage: "Thêm lịch học thành công!",
    errorMessage: "Thêm lịch học thất bại!",
    onSuccess: () => closeModal(),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="max-h-[85vh] space-y-6 overflow-y-auto py-2 pr-2"
    >
      <Controller
        name="userId"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Học viên"
            placeholder="Chọn học viên"
            prefixIcon={<HiOutlineAcademicCap />}
            value={value}
            onChange={(selectedValue) => onChange(selectedValue)}
            options={studentOptions}
            hasNextPage={hasNextStudents}
            isFetchingNextPage={isFetchingNextStudents}
            onLoadMore={fetchNextStudents}
            isLoading={isLoadingStudents}
            error={errors.userId?.message}
            emptyText="Không tìm thấy học viên"
            required
            filter={{
              enabled: true,
              mode: "server",
              onChange: setStudentSearch,
              placeholder: "Tìm theo họ tên học viên...",
            }}
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
          Thêm lịch học
        </Button>
      </div>
    </form>
  );
}
