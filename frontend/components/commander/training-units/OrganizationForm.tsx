"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingUnitService, Organization } from "@/services/training-unit";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineCollection, HiOutlineClock } from "react-icons/hi";

const schema = z.object({
  organizationName: z.string().min(1, "Tên đơn vị là bắt buộc"),
  travelTime: z.coerce.number().min(0, "Thời gian di chuyển không được âm"),
  universityId: z.string().min(1, "University ID is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  organization?: Organization;
  universityId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OrganizationForm({ organization, universityId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const isEdit = !!organization;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationName: organization?.organizationName || "",
      travelTime: organization?.travelTime || 0,
      universityId: universityId,
      status: organization?.status || "ACTIVE",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit
        ? trainingUnitService.updateOrganization(organization.id, data)
        : trainingUnitService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITY_HIERARCHY] });
      addToast({
        message: `${isEdit ? "Cập nhật" : "Thêm mới"} đơn vị thành công!`,
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
        label="Tên đơn vị / Chuyên ngành"
        placeholder="VD: Khoa Công nghệ thông tin..."
        prefixIcon={<HiOutlineCollection />}
        error={errors.organizationName?.message}
        {...register("organizationName")}
        required
      />
      <Input
        label="Thời gian di chuyển (phút)"
        type="number"
        placeholder="Thời gian đi từ đơn vị về trường (để tính cắt cơm)..."
        prefixIcon={<HiOutlineClock />}
        error={errors.travelTime?.message}
        {...register("travelTime")}
        required
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="neutral" onClick={onCancel} type="button">
          Hủy bỏ
        </Button>
        <Button variant="secondary" isLoading={mutation.isPending} type="submit">
          {isEdit ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
}
