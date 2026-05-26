"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiOutlineCash, HiOutlineClipboardList, HiOutlineAcademicCap, HiOutlineCalendar } from "react-icons/hi";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import Input from "@/library/Input";
import Select from "@/library/Select";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import useAppMutation from "@/hooks/useAppMutation";
import { useModalStore } from "@/store/useModalStore";
import { tuitionFeeService } from "@/services/tuition-fees";
import { createTuitionFeeSchema, CreateTuitionFeeFormValues } from "@/utils/validations";

export default function CreateTuitionFeeForm() {
  const { closeModal } = useModalStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTuitionFeeFormValues>({
    resolver: zodResolver(createTuitionFeeSchema),
    defaultValues: {
      studentId: "",
      totalAmount: 0,
      semester: "",
      schoolYear: "",
      content: "",
      status: "UNPAID",
    },
  });

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.CREATE_TUITION_FEE,
    mutationFn: (data: CreateTuitionFeeFormValues) => tuitionFeeService.createTuitionFee(data),
    invalidateQueryKey: [QUERY_KEYS.TUITION_FEES],
    successMessage: "Ghi nhận học phí thành công!",
    errorMessage: "Ghi nhận học phí thất bại!",
    onSuccess: () => closeModal(),
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5 py-2">
      <Input
        label="ID học viên"
        placeholder="Nhập ID học viên"
        prefixIcon={<HiOutlineAcademicCap />}
        error={errors.studentId?.message}
        isLoading={mutation.isPending}
        {...register("studentId")}
        required
      />

      <Input
        label="Số tiền cần nộp"
        type="number"
        placeholder="VD: 2500000"
        prefixIcon={<HiOutlineCash />}
        error={errors.totalAmount?.message}
        isLoading={mutation.isPending}
        {...register("totalAmount", { valueAsNumber: true })}
        required
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Học kỳ"
          placeholder="VD: HK1"
          prefixIcon={<HiOutlineCalendar />}
          error={errors.semester?.message}
          isLoading={mutation.isPending}
          {...register("semester")}
          required
        />
        <Input
          label="Năm học"
          placeholder="VD: 2024-2025"
          prefixIcon={<HiOutlineCalendar />}
          error={errors.schoolYear?.message}
          isLoading={mutation.isPending}
          {...register("schoolYear")}
          required
        />
      </div>

      <Input
        label="Nội dung"
        placeholder="VD: Học phí học kỳ 1 năm học 2024-2025"
        prefixIcon={<HiOutlineClipboardList />}
        error={errors.content?.message}
        isLoading={mutation.isPending}
        {...register("content")}
        required
      />

      <Controller
        name="status"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Trạng thái"
            error={errors.status?.message}
            options={[
              { label: "Chưa thanh toán", value: "UNPAID" },
              { label: "Đã thanh toán", value: "PAID" },
            ]}
            value={value}
            onChange={(value) => onChange(value)}
            isLoading={mutation.isPending}
            required
          />
        )}
      />

      <Divide />
      <div className="flex justify-end gap-3 px-4">
        <Button variant="ghost" type="button" onClick={closeModal} isLoading={mutation.isPending}>
          Hủy bỏ
        </Button>
        <Button variant="primary" type="submit" isLoading={mutation.isPending}>
          Ghi nhận
        </Button>
      </div>
    </form>
  );
}
