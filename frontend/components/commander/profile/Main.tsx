"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { QUERY_KEYS } from "@/constants/query-keys";
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineIdentification,
  HiOutlineCalendar,
  HiOutlineShieldCheck,
  HiOutlineBriefcase,
  HiOutlineFlag,
  HiOutlinePencil
} from "react-icons/hi";
import Typography from "@/library/Typography";
import AnimatedContainer from "@/library/AnimatedContainer";
import Avatar from "@/library/Avatar";
import { DEFAULT_VALUES } from "@/constants/constants";
import { formatDate } from "@/utils/fn-common";
import { useModalStore } from "@/store/useModalStore";
import ProfileForm from "./ProfileForm";
import DetailUserForm from "@/components/admin/accounts/DetailUserForm";

export default function Main() {
  const { openModal } = useModalStore();
  const { data: profileResponse, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => authService.getProfile(),
  });

  const profile = profileResponse?.data;
  const commander = profile?.commander;

  const handleUpdateProfile = () => {
    openModal({
      title: "Cập nhật hồ sơ cá nhân",
      content: <ProfileForm initialData={commander} />,
      size: "lg"
    });
  };

  const handleViewDetail = () => {
    if (!profile) return;
    openModal({
      title: "Chi tiết hồ sơ hệ thống",
      content: <DetailUserForm userId={profile.id} initialData={profile} />,
      size: "xl"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value?: string | number | null }) => (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 border border-neutral-100/50 hover:bg-white hover:shadow-sm transition-all group">
      <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <Typography variant="label" color="gray" className="mb-0.5">{label}</Typography>
        <Typography variant="body" weight="semibold" className="text-neutral-800">
          {value || "---"}
        </Typography>
      </div>
    </div>
  );

  return (
    <AnimatedContainer className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar
              src={commander?.avatar}
              alt={commander?.fullName}
              size={120}
              className="border-4 border-white shadow-xl shadow-primary-900/10"
            />
            <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center border-4 border-white shadow-lg hover:bg-primary-700 transition-all">
              <HiOutlinePencil size={18} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Typography variant="h1" weight="black" transform="uppercase" className="tracking-tight">
                {commander?.fullName || DEFAULT_VALUES.DEFAULT_COMMANDER_NAME}
              </Typography>
              <div className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-[10px] font-black uppercase tracking-widest">
                {commander?.rank || "Chưa cập nhật"}
              </div>
            </div>
            <Typography variant="body" color="gray" className="mt-1 flex items-center gap-2">
              <HiOutlineIdentification size={16} />
              Mã chỉ huy: {commander?.commanderId || "---"}
            </Typography>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleViewDetail}
            className="flex items-center gap-2 px-6 py-3.5 bg-neutral-50 text-neutral-700 rounded-2xl hover:bg-neutral-100 transition-all font-bold"
          >
            Xem chi tiết hệ thống
          </button>
          <button 
            onClick={handleUpdateProfile}
            className="flex items-center gap-2 px-6 py-3.5 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-200 transition-all font-bold shadow-sm"
          >
            <HiOutlinePencil size={20} />
            Cập nhật hồ sơ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-primary-500 rounded-full" />
              <Typography variant="h3" weight="black" transform="uppercase">Thông tin cơ bản</Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={HiOutlineUser} label="Họ và tên" value={commander?.fullName} />
              <InfoItem icon={HiOutlineCalendar} label="Ngày sinh" value={formatDate(commander?.birthday)} />
              <InfoItem icon={HiOutlineUser} label="Giới tính" value={commander?.gender === 'MALE' ? 'Nam' : 'Nữ'} />
              <InfoItem icon={HiOutlineIdentification} label="Số CCCD" value={commander?.cccd} />
              <InfoItem icon={HiOutlineMail} label="Email" value={commander?.email} />
              <InfoItem icon={HiOutlinePhone} label="Số điện thoại" value={commander?.phoneNumber} />
              <InfoItem icon={HiOutlinePhone} label="Quê quán" value={commander?.hometown} />
              <InfoItem icon={HiOutlinePhone} label="Địa chỉ hiện tại" value={commander?.currentAddress} />
            </div>
          </section>

          <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-secondary-500 rounded-full" />
              <Typography variant="h3" weight="black" transform="uppercase">Công tác & Chính trị</Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={HiOutlineShieldCheck} label="Cấp bậc" value={commander?.rank} />
              <InfoItem icon={HiOutlineBriefcase} label="Đơn vị" value={commander?.unit} />
              <InfoItem icon={HiOutlineFlag} label="Chức vụ chính quyền" value={commander?.positionGovernment} />
              <InfoItem icon={HiOutlineFlag} label="Chức vụ Đảng" value={commander?.positionParty} />
              <InfoItem icon={HiOutlineCalendar} label="Ngày nhập ngũ" value={formatDate(commander?.dateOfEnlistment)} />
              <InfoItem icon={HiOutlineCalendar} label="Thâm niên (Năm)" value={commander?.startWork} />
            </div>
          </section>
        </div>

        {/* Cột phải: Thông tin Đảng */}
        <div className="space-y-8">
          <section className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[32px] p-8 shadow-xl text-white relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <HiOutlineShieldCheck size={28} className="text-primary-200" />
                <Typography variant="h3" weight="black" transform="uppercase" color="white">Thông tin Đảng viên</Typography>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <Typography variant="label" color="white" className="opacity-60 mb-1">Số thẻ Đảng</Typography>
                  <Typography variant="body" weight="bold">{commander?.partyMemberCardNumber || "Chưa cập nhật"}</Typography>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <Typography variant="label" color="white" className="opacity-60 mb-1">Ngày vào Đảng (Dự bị)</Typography>
                  <Typography variant="body" weight="bold">{formatDate(commander?.probationaryPartyMember) || "---"}</Typography>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <Typography variant="label" color="white" className="opacity-60 mb-1">Ngày vào Đảng (Chính thức)</Typography>
                  <Typography variant="body" weight="bold">{formatDate(commander?.fullPartyMember) || "---"}</Typography>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <HiOutlineFlag size={24} />
                  </div>
                  <div>
                    <Typography variant="body" weight="black" transform="uppercase">Đảng bộ Học viện</Typography>
                    <Typography variant="caption" className="opacity-60">Chi bộ đơn vị quản lý</Typography>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-sm">
            <Typography variant="h3" weight="black" transform="uppercase" className="mb-6">Dữ liệu hệ thống</Typography>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <Typography variant="body" color="gray">Ngày tham gia</Typography>
                <Typography variant="body" weight="bold">{formatDate(commander?.createdAt)}</Typography>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                <Typography variant="body" color="gray">Cập nhật cuối</Typography>
                <Typography variant="body" weight="bold">{formatDate(commander?.updatedAt)}</Typography>
              </div>
              <div className="flex justify-between items-center py-3">
                <Typography variant="body" color="gray">Trạng thái tài khoản</Typography>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">
                  Hoạt động
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AnimatedContainer>
  );
}
