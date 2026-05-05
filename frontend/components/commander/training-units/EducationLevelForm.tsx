"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingUnitService, EducationLevel } from "@/services/training-unit";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineAcademicCap } from "react-icons/hi";

const schema = z.object({
  levelName: z.string().min(1, "Tên trình độ là bắt buộc"),
  organizationId: z.string().min(1, "Organization ID is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  level?: EducationLevel;
  organizationId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EducationLevelForm({ level, organizationId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const isEdit = !!level;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      levelName: level?.levelName || "",
      organizationId: organizationId,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? trainingUnitService.updateEducationLevel(level.id, data)
        : trainingUnitService.createEducationLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({
        message: `${isEdit ? "Cập nhật" : "Thêm mới"} trình độ thành công!`,
        variant: "success",
      });
      onSuccess();
    },
    onError: (err: any) => {
      addToast({
        message: err.message || "Đã có lỗi xảy ra!",
        variant: "error",
      });
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      <Input
        label="Tên trình độ đào tạo"
        placeholder="VD: Đại học, Cao đẳng, Sau đại học..."
        prefixIcon={<HiOutlineAcademicCap />}
        error={errors.levelName?.message}
        {...register("levelName")}
        required
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="neutral" onClick={onCancel} type="button">
          Hủy bỏ
        </Button>
        <Button variant="secondary" color="secondary" isLoading={mutation.isPending} type="submit">
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
}
