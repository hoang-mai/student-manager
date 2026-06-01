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
import { TuitionFee } from "@/types/tuition-fees";
import { updateTuitionFeeSchema, UpdateTuitionFeeFormValues } from "@/utils/validations";

export default function UpdateTuitionFeeForm({ tuitionFee }: { tuitionFee: TuitionFee }) {
  const { closeModal } = useModalStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateTuitionFeeFormValues>({
    resolver: zodResolver(updateTuitionFeeSchema),
    defaultValues: {
      userId: tuitionFee.userId || tuitionFee.studentId,
      totalAmount: tuitionFee.totalAmount,
      semester: tuitionFee.semester,
      schoolYear: tuitionFee.schoolYear,
      content: tuitionFee.content,
      status: tuitionFee.status,
    },
  });

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.UPDATE_TUITION_FEE,
    mutationFn: (data: UpdateTuitionFeeFormValues) => tuitionFeeService.updateTuitionFee(tuitionFee.id, data),
    invalidateQueryKey: [QUERY_KEYS.TUITION_FEES],
    successMessage: "Cập nhật học phí thành công!",
    errorMessage: "Cập nhật học phí thất bại!",
    onSuccess: () => closeModal(),
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5 py-2">
      <Input
        label="ID tài khoản học viên"
        placeholder="Nhập ID tài khoản học viên"
        prefixIcon={<HiOutlineAcademicCap />}
        error={errors.userId?.message}
        isLoading={mutation.isPending}
        {...register("userId")}
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
        <Button variant="primary" type="submit" disabled={!isDirty} isLoading={mutation.isPending}>
          Cập nhật
        </Button>
      </div>
    </form>
  );
}
