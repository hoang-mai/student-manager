"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingUnitService, Class } from "@/services/training-unit";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineUserGroup } from "react-icons/hi";

const schema = z.object({
  className: z.string().min(1, "Tên lớp là bắt buộc"),
  studentCount: z.coerce.number().min(0, "Số lượng học viên không được âm"),
  educationLevelId: z.string().min(1, "Education Level ID is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  cls?: Class;
  educationLevelId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClassForm({ cls, educationLevelId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const isEdit = !!cls;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      className: cls?.className || "",
      studentCount: cls?.studentCount || 0,
      educationLevelId: educationLevelId,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? trainingUnitService.updateClass(cls.id, data)
        : trainingUnitService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({
        message: `${isEdit ? "Cập nhật" : "Thêm mới"} lớp học thành công!`,
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
        {...register("studentCount")}
        required
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="neutral" onClick={onCancel} type="button">
          Hủy bỏ
        </Button>
        <Button variant="primary" isLoading={mutation.isPending} type="submit">
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
}
