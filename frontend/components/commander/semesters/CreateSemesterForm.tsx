"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSemesterSchema,
  CreateSemesterFormValues,
} from "@/utils/validations";
import { semesterService } from "@/services/semesters";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import DateRangePicker from "@/library/DateRangePicker";
import Select from "@/library/Select";
import { HiOutlineAcademicCap } from "react-icons/hi";
import useAppMutation from "@/hooks/useAppMutation";
import { useModalStore } from "@/store/useModalStore";

export default function CreateSemesterForm() {
  const { closeModal } = useModalStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateSemesterFormValues>({
    resolver: zodResolver(createSemesterSchema),
    defaultValues: {
      code: "",
      schoolYear: "",
    },
  });

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.CREATE_SEMESTER,
    mutationFn: (data: CreateSemesterFormValues) =>
      semesterService.createSemester(data),
    invalidateQueryKey: [QUERY_KEYS.SEMESTERS],
    successMessage: "Thêm học kỳ thành công!",
    errorMessage: "Đã có lỗi xảy ra!",
    onSuccess: () => closeModal(),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6 py-2"
    >
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <Select
            label="Học kỳ"
            placeholder="Chọn học kỳ"
            prefixIcon={<HiOutlineAcademicCap />}
            options={[1, 2, 3, 4, 5].map((semester) => ({
              value: `HK${semester}`,
              label: `Học kỳ ${semester}`,
            }))}
            value={field.value}
            onChange={field.onChange}
            error={errors.code?.message}
            isLoading={mutation.isPending}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="schoolYear"
        render={({ field }) => {
          const [startYear, endYear] = (field.value || "").split("-");
          return (
            <DateRangePicker
              label="Năm học"
              mode="YYYY"
              maxRange={1}
              required
              disabled={mutation.isPending}
              isLoading={mutation.isPending}
              error={errors.schoolYear?.message}
              value={{
                startDate: startYear || undefined,
                endDate: endYear || undefined,
              }}
              onChange={(v) => {
                if (v.startDate && v.endDate) {
                  field.onChange(`${v.startDate}-${v.endDate}`);
                } else {
                  field.onChange("");
                }
              }}
            />
          );
        }}
      />

      <div className="flex flex-col gap-4">
        <Divide />
        <div className="flex items-center justify-end gap-3 px-4">
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
            isLoading={mutation.isPending}
            disabled={!isDirty}
          >
            Thêm mới
          </Button>
        </div>
      </div>
    </form>
  );
}
