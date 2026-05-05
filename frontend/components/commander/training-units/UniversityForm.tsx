"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingUnitService, University } from "@/services/training-unit";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineOfficeBuilding, HiOutlineIdentification } from "react-icons/hi";

const schema = z.object({
  universityCode: z.string().min(1, "Mã trường là bắt buộc"),
  universityName: z.string().min(1, "Tên trường là bắt buộc"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  university?: University;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UniversityForm({ university, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const isEdit = !!university;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      universityCode: university?.universityCode || "",
      universityName: university?.universityName || "",
      status: university?.status || "ACTIVE",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? trainingUnitService.updateUniversity(university.id, data)
        : trainingUnitService.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({
        message: `${isEdit ? "Cập nhật" : "Thêm mới"} trường thành công!`,
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
        label="Mã trường"
        placeholder="VD: NEU, HUST..."
        prefixIcon={<HiOutlineIdentification />}
        error={errors.universityCode?.message}
        {...register("universityCode")}
        required
      />
      <Input
        label="Tên trường đại học"
        placeholder="Nhập tên đầy đủ của trường..."
        prefixIcon={<HiOutlineOfficeBuilding />}
        error={errors.universityName?.message}
        {...register("universityName")}
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
