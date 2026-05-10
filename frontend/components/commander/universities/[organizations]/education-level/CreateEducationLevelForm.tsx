"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organizations";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { createEducationLevelSchema, CreateEducationLevelFormValues } from "@/utils/validations";
import Divide from "@/library/Divide";
import { useLoadingStore } from "@/store/useLoadingStore";

interface Props {
  organizationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateEducationLevelForm({ organizationId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateEducationLevelFormValues>({
    resolver: zodResolver(createEducationLevelSchema),
    defaultValues: {
      levelName: "",
      organizationId: organizationId,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateEducationLevelFormValues) => {
      showLoading();
      return organizationService.createEducationLevel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EDUCATION_LEVELS, organizationId] });
      addToast({
        message: "Thêm mới trình độ thành công!",
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
        label="Tên trình độ đào tạo"
        placeholder="VD: Đại học, Cao đẳng, Sau đại học..."
        prefixIcon={<HiOutlineAcademicCap />}
        error={errors.levelName?.message}
        {...register("levelName")}
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
