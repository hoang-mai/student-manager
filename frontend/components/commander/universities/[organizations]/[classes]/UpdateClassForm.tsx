"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClassSchema, UpdateClassFormValues } from "@/utils/validations";
import { classService } from "@/services/classes";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import Divide from "@/library/Divide";
import { useLoadingStore } from "@/store/useLoadingStore";
import { HiOutlineUserGroup } from "react-icons/hi";
import { Class } from "@/types/classes";

interface Props {
  cls: Class;
  educationLevelId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateClassForm({ cls, educationLevelId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateClassFormValues>({
    resolver: zodResolver(updateClassSchema),
    defaultValues: {
      className: cls.className,
      studentCount: cls.studentCount,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdateClassFormValues) => {
      showLoading();
      return classService.updateClass(cls.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES, educationLevelId] });
      addToast({
        message: "Cập nhật lớp học thành công!",
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

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6 py-2">
      <Input
        label="Tên lớp học"
        placeholder="VD: CNTT-K60, AT15..."
        prefixIcon={<HiOutlineUserGroup />}
        error={errors.className?.message}
        {...register("className")}
        required
      />
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
            disabled={!isDirty}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </form>
  );
}
