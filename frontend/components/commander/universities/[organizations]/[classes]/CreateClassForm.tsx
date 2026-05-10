"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClassSchema, CreateClassFormValues } from "@/utils/validations";
import { classService } from "@/services/classes";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineUserGroup } from "react-icons/hi";
import Divide from "@/library/Divide";
import { useLoadingStore } from "@/store/useLoadingStore";

interface Props {
  educationLevelId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateClassForm({ educationLevelId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: "",
      studentCount: 0,
      educationLevelId: educationLevelId,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateClassFormValues) => {
      showLoading();
      return classService.createClass(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CLASSES, educationLevelId] });
      addToast({
        message: "Thêm mới lớp học thành công!",
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
            Thêm mới
          </Button>
        </div>
      </div>
    </form>
  );
}
