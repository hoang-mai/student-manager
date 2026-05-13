"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/library/Button";
import Input from "@/library/Input";
import Select from "@/library/Select";
import Typography from "@/library/Typography";
import { UserDetailResponse, UpdateProfileRequest } from "@/types/user";
import { userService } from "@/services/user";
import { QUERY_KEYS } from "@/constants/query-keys";
import { updateUserSchema, UpdateUserFormValues } from "@/utils/validations";
import Divide from "@/library/Divide";
import { RANKS, GENDER } from "@/constants/constants";
import DatePicker from "@/library/DatePicker";
import { useModalStore } from "@/store/useModalStore";
import useAppMutation from "@/hooks/useAppMutation";

interface UpdateUserFormProps {
  user: UserDetailResponse;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user }) => {
  const { closeModal } = useModalStore();

  const updateMutation = useAppMutation({
    mutationFn: (data: UpdateProfileRequest) => userService.updateUser(user.id, data),
    invalidateQueryKey: [QUERY_KEYS.USERS],
    successMessage: "Cập nhật thành công!",
    errorMessage: "Cập nhật thất bại!",
    onSuccess: () => closeModal(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user.username,
      fullName: user.profile?.fullName,
      email: user.profile?.email,
      phoneNumber: user.profile?.phoneNumber,
      code: user.profile?.code,
      birthday: user.profile?.birthday,
      cccd: user.profile?.cccd,
      gender: user.profile?.gender,
      hometown: user.profile?.hometown,
      placeOfBirth: user.profile?.placeOfBirth,
      ethnicity: user.profile?.ethnicity,
      religion: user.profile?.religion,
      rank: user.profile?.rank,
      unit: user.profile?.unit,
      positionGovernment: user.profile?.positionGovernment,
      positionParty: user.profile?.positionParty,
      currentAddress: user.profile?.currentAddress,
      dateOfEnlistment: user.profile?.dateOfEnlistment,
      enrollment: user.profile?.enrollment,
      currentCpa4: user.profile?.currentCpa4,
      currentCpa10: user.profile?.currentCpa10,
      graduationDate: user.profile?.graduationDate,
      partyMemberCardNumber: user.profile?.partyMemberCardNumber,
      probationaryPartyMember: user.profile?.probationaryPartyMember,
      fullPartyMember: user.profile?.fullPartyMember,
      familyMember: user.profile?.familyMember,
      foreignRelations: user.profile?.foreignRelations,
      startWork: user.profile?.startWork,
    },
  });

  const onSubmit: SubmitHandler<UpdateUserFormValues> = (data) => {
    const formattedData = { ...data };
    
    const dateFields = [
      "birthday",
      "dateOfEnlistment",
      "graduationDate",
      "probationaryPartyMember",
      "fullPartyMember",
    ] as const;

    dateFields.forEach((field) => {
      if (formattedData[field] === "") {
        formattedData[field] = null;
      }
    });

    updateMutation.mutate(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-h-[85vh] py-2 gap-4"
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-12">
        {/* Thông tin cơ bản & liên hệ */}
        <section>
          <SectionHeader title="Thông tin cơ bản & liên hệ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Họ và tên"
              placeholder="Ví dụ: Nguyễn Văn A"
              {...register("fullName")}
              error={errors.fullName?.message}
              required
            />
            <Input
              label="Tên đăng nhập (Username)"
              placeholder="Ví dụ: nguyenvana"
              {...register("username")}
              error={errors.username?.message}
              required
            />
            <Input
              label="Email"
              placeholder="Ví dụ: vana@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Số điện thoại"
              placeholder="Ví dụ: 0987654321"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
            <div className="md:col-span-2">
              <Input
                label="Địa chỉ hiện tại"
                placeholder="Nhập địa chỉ hiện tại"
                {...register("currentAddress")}
                error={errors.currentAddress?.message}
              />
            </div>
          </div>
        </section>

        {/* Thông tin cá nhân */}
        <section>
          <SectionHeader title="Thông tin cá nhân" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Ngày sinh"
                  placeholder="Chọn ngày sinh"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.birthday?.message}
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  label="Giới tính"
                  required={true}
                  placeholder="Chọn giới tính"
                  options={Object.entries(GENDER).map(([key, value]) => ({ value: key, label: value }))}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.gender?.message}
                />
              )}
            />
            <Input
              label="Số CCCD"
              placeholder="Nhập số CCCD"
              {...register("cccd")}
              error={errors.cccd?.message}
            />
            <Input
              label="Quê quán"
              placeholder="Nhập quê quán"
              {...register("hometown")}
              error={errors.hometown?.message}
            />
            <Input
              label="Nơi sinh"
              placeholder="Nhập nơi sinh"
              {...register("placeOfBirth")}
              error={errors.placeOfBirth?.message}
            />
            <Input
              label="Dân tộc"
              placeholder="Ví dụ: Kinh"
              {...register("ethnicity")}
              error={errors.ethnicity?.message}
            />
            <Input
              label="Tôn giáo"
              placeholder="Ví dụ: Không"
              {...register("religion")}
              error={errors.religion?.message}
            />
          </div>
        </section>

        {/* Thông tin học tập & công tác */}
        <section>
          <SectionHeader
            title={
              user.role === "STUDENT"
                ? "Học tập & Công tác"
                : "Công tác & Chức vụ"
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Mã số / Mã HV"
              placeholder="Nhập mã số / mã HV"
              {...register("code")}
              error={errors.code?.message}
            />
            <Controller
              name="rank"
              control={control}
              render={({ field }) => (
                <Select
                  label="Cấp bậc"
                  placeholder="Chọn cấp bậc"
                  value={field.value}
                  onChange={field.onChange}
                  options={Object.entries(RANKS).map(([key, value]) => ({ value: key, label: value }))}
                  error={errors.rank?.message}
                />
              )}
            />
            <Input
              label="Đơn vị"
              placeholder="Ví dụ: c1, d1..."
              {...register("unit")}
              error={errors.unit?.message}
            />
            <Controller
              name="dateOfEnlistment"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Ngày nhập ngũ"
                  placeholder="Chọn ngày nhập ngũ"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.dateOfEnlistment?.message}
                />
              )}
            />
            <Input
              label="Chức vụ chính quyền"
              placeholder="Ví dụ: Lớp trưởng"
              {...register("positionGovernment")}
              error={errors.positionGovernment?.message}
            />

            {user.role === "STUDENT" && (
              <>
                <Input
                  label="Khóa học"
                  type="number"
                  placeholder="Ví dụ: 58"
                  {...register("enrollment", { valueAsNumber: true })}
                  error={errors.enrollment?.message}
                />
                <Controller
                  name="graduationDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Ngày tốt nghiệp"
                      placeholder="Chọn ngày tốt nghiệp"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.graduationDate?.message}
                    />
                  )}
                />
                <Input
                  label="CPA 4.0"
                  type="number"
                  step="0.01"
                  placeholder="Ví dụ: 3.2"
                  {...register("currentCpa4", { valueAsNumber: true })}
                  error={errors.currentCpa4?.message}
                />
                <Input
                  label="CPA 10.0"
                  type="number"
                  step="0.01"
                  placeholder="Ví dụ: 8.0"
                  {...register("currentCpa10", { valueAsNumber: true })}
                  error={errors.currentCpa10?.message}
                />
              </>
            )}

            {user.role === "COMMANDER" && (
              <Input
                label="Năm bắt đầu công tác"
                type="number"
                placeholder="Ví dụ: 2020"
                {...register("startWork", { valueAsNumber: true })}
                error={errors.startWork?.message}
              />
            )}
          </div>
        </section>

        {/* Đảng & Đoàn - Quan hệ */}
        <section>
          <SectionHeader title="Đảng & Đoàn - Quan hệ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <Input
              label="Chức vụ Đảng"
              placeholder="Ví dụ: Đảng viên"
              {...register("positionParty")}
              error={errors.positionParty?.message}
            />
            <Input
              label="Số thẻ Đảng"
              placeholder="Nhập số thẻ Đảng"
              {...register("partyMemberCardNumber")}
              error={errors.partyMemberCardNumber?.message}
            />
            <Controller
              name="probationaryPartyMember"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Ngày vào Đảng (dự bị)"
                  placeholder="Chọn ngày vào Đảng (dự bị)"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.probationaryPartyMember?.message}
                />
              )}
            />
            <Controller
              name="fullPartyMember"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Ngày vào Đảng (chính thức)"
                  placeholder="Chọn ngày vào Đảng (chính thức)"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.fullPartyMember?.message}
                />
              )}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Thành phần gia đình"
                placeholder="Ví dụ: Nông dân"
                {...register("familyMember")}
                error={errors.familyMember?.message}
              />
              <Input
                label="Quan hệ nước ngoài"
                placeholder="Ví dụ: Không"
                {...register("foreignRelations")}
                error={errors.foreignRelations?.message}
              />
            </div>
          </div>
        </section>
      </div>
      <div className="flex flex-col gap-4">
        <Divide />
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => closeModal()}
            isLoading={updateMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={updateMutation.isPending}
            disabled={!isDirty}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateUserForm;

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-2 h-8 bg-primary-500 rounded-full" />
    <Typography
      variant="h4"
      weight="bold"
      transform="uppercase"
      className="tracking-tight text-neutral-800"
    >
      {title}
    </Typography>
  </div>
);
