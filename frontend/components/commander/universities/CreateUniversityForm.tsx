"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@/library/Button";
import Input from "@/library/Input";
import Select from "@/library/Select";
import Divide from "@/library/Divide";
import { universityService } from "@/services/universities";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { universitySchema, UniversityFormValues } from "@/utils/validations";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateUniversityForm({ onSuccess, onCancel }: Props) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const mutation = useMutation({
    mutationFn: (data: UniversityFormValues) => {
      showLoading();
      return universityService.createUniversity(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.UNIVERSITIES] });
      addToast({ message: "Thêm mới thành công!", variant: "success" });
      onSuccess();
    },
    onError: (err: any) => {
      addToast({
        message: err.message || "Thêm mới thất bại!",
        variant: "error",
      });
    },
    onSettled: () => hideLoading(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      universityCode: "",
      universityName: "",
      status: "ACTIVE",
    },
  });

  const onSubmit: SubmitHandler<UniversityFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-2 gap-4">
      <div className="flex-1 px-4 py-4 space-y-8">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Mã trường"
              placeholder="Ví dụ: T01, T02..."
              {...register("universityCode")}
              error={errors.universityCode?.message}
              required
            />
            <Input
              label="Tên trường"
              placeholder="Ví dụ: Học viện Kỹ thuật Quân sự"
              {...register("universityName")}
              error={errors.universityName?.message}
              required
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  label="Trạng thái"
                  required={true}
                  placeholder="Chọn trạng thái"
                  options={[
                    { label: "Hoạt động", value: "ACTIVE" },
                    { label: "Tạm dừng", value: "INACTIVE" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />
          </div>
        </section>
      </div>

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
