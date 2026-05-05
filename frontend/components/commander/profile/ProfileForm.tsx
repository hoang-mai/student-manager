"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { QUERY_KEYS } from "@/constants/query-keys";
import { Commander } from "@/types/user";
import { useToastStore } from "@/store/useToastStore";
import Input from "@/library/Input";
import Button from "@/library/Button";
import { useModalStore } from "@/store/useModalStore";

const profileSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phoneNumber: z.string().min(10, "Số điện thoại không hợp lệ"),
  birthday: z.string().optional(),
  cccd: z.string().optional(),
  currentAddress: z.string().optional(),
  hometown: z.string().optional(),
  placeOfBirth: z.string().optional(),
  ethnicity: z.string().optional(),
  religion: z.string().optional(),
  rank: z.string().optional(),
  unit: z.string().optional(),
  positionGovernment: z.string().optional(),
  positionParty: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData?: Commander | null;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalStore();
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      birthday: initialData?.birthday ? new Date(initialData.birthday).toISOString().split('T')[0] : "",
      cccd: initialData?.cccd || "",
      currentAddress: initialData?.currentAddress || "",
      hometown: initialData?.hometown || "",
      placeOfBirth: initialData?.placeOfBirth || "",
      ethnicity: initialData?.ethnicity || "",
      religion: initialData?.religion || "",
      rank: initialData?.rank || "",
      unit: initialData?.unit || "",
      positionGovernment: initialData?.positionGovernment || "",
      positionParty: initialData?.positionParty || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProfileFormValues) => authService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      addToast({ message: "Cập nhật hồ sơ thành công", variant: "success" });
      closeModal();
    },
    onError: (error: any) => {
      addToast({ message: error?.message || "Cập nhật thất bại", variant: "error" });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Email"
          placeholder="Nhập email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />
        <Input
          label="Ngày sinh"
          type="date"
          error={errors.birthday?.message}
          {...register("birthday")}
        />
        <Input
          label="Số CCCD"
          placeholder="Nhập số CCCD"
          error={errors.cccd?.message}
          {...register("cccd")}
        />
        <Input
          label="Quê quán"
          placeholder="Nhập quê quán"
          error={errors.hometown?.message}
          {...register("hometown")}
        />
        <Input
          label="Dân tộc"
          placeholder="Nhập dân tộc"
          error={errors.ethnicity?.message}
          {...register("ethnicity")}
        />
        <Input
          label="Tôn giáo"
          placeholder="Nhập tôn giáo"
          error={errors.religion?.message}
          {...register("religion")}
        />
      </div>

      <div className="pt-4 border-t border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Cấp bậc"
            placeholder="Nhập cấp bậc"
            error={errors.rank?.message}
            {...register("rank")}
          />
          <Input
            label="Đơn vị"
            placeholder="Nhập đơn vị"
            error={errors.unit?.message}
            {...register("unit")}
          />
          <Input
            label="Chức vụ chính quyền"
            placeholder="Nhập chức vụ"
            error={errors.positionGovernment?.message}
            {...register("positionGovernment")}
          />
          <Input
            label="Chức vụ Đảng"
            placeholder="Nhập chức vụ Đảng"
            error={errors.positionParty?.message}
            {...register("positionParty")}
          />
        </div>
      </div>

      <Input
        label="Địa chỉ hiện tại"
        placeholder="Nhập địa chỉ"
        error={errors.currentAddress?.message}
        {...register("currentAddress")}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="neutral" type="button" onClick={closeModal}>
          Hủy bỏ
        </Button>
        <Button variant="primary" type="submit" isLoading={mutation.isPending}>
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
