"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/services/organizations";
import { QUERY_KEYS } from "@/constants/query-keys";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useToastStore } from "@/store/useToastStore";
import { HiOutlineCollection, HiOutlineClock } from "react-icons/hi";
import Divide from "@/library/Divide";
import { useLoadingStore } from "@/store/useLoadingStore";

import { createOrganizationSchema, CreateOrganizationFormValues } from "@/utils/validations";

interface Props {
  universityId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateOrganizationForm({ universityId, onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateOrganizationFormValues>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      organizationName: "",
      travelTime: 0,
      universityId: universityId,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateOrganizationFormValues) => {
      showLoading();
      return organizationService.createOrganization(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANIZATIONS, universityId] });
      addToast({
        message: "Thêm mới đơn vị thành công!",
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
        {...register("travelTime", { valueAsNumber: true })}
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
