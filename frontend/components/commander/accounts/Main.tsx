"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { UserQueryParams } from "@/types/user";
import { User } from "@/types/auth";
import { ROLES } from "@/constants/constants";
import AnimatedContainer from "@/library/AnimatedContainer";
import Button from "@/library/Button";
import Input from "@/library/Input";
import Divide from "@/library/Divide";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineDownload,
  HiOutlineAcademicCap,
  HiOutlineOfficeBuilding,
  HiOutlineRefresh,
  HiOutlineX
} from "react-icons/hi";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import UserFormModal from "./UserFormModal";

export default function Main() {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  // State lọc và phân trang
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    role: ROLES.STUDENT.role,
  });

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Query lấy danh sách người dùng
  const { data, isLoading } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => userService.getAllUsers(queryParams),
  });

  // Mutation: Tạo người dùng
  const createMutation = useMutation({
    mutationFn: (data: any) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || "Thêm thất bại!", variant: "error" });
    }
  });

  // Mutation: Cập nhật người dùng
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({ message: "Cập nhật thành công!", variant: "success" });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      addToast({ message: err.response?.data?.message || "Cập nhật thất bại!", variant: "error" });
    }
  });

  // Mutation: Thay đổi trạng thái tài khoản
  const toggleActiveMutation = useMutation({
    mutationFn: (id: number) => userService.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      addToast({ message: "Cập nhật trạng thái thành công!", variant: "success" });
    },
    onError: () => {
      addToast({ message: "Cập nhật trạng thái thất bại!", variant: "error" });
    }
  });

  const handleOpenModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQueryParams({ ...queryParams, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams({ ...queryParams, page: newPage });
  };

  return (
    <AnimatedContainer variant="slideUp" className="space-y-8 relative">
      {/* Background patterns */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary-50/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
        <HiOutlineHome size={14} className="mb-0.5" />
        <span>Trang chủ</span>
        <HiOutlineChevronRight size={12} />
        <span className="text-primary-600">Danh sách học viên</span>
      </div>

      {/* Header & Actions */}
      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-neutral-800 tracking-tight uppercase">
            Danh sách học viên - Năm học
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineRefresh size={16} />
            Cập nhật học viên ra trường
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineOfficeBuilding size={16} />
            Quản lý Trường
          </button>
          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => handleOpenModal()}
            className="h-10 px-5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary-600/20"
          >
            Thêm Học viên
          </Button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-all">
            <HiOutlineDownload size={16} />
            Xuất Excel QLCTNB
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest ml-1">Nhập tên</label>
            <div className="relative group">
              <input
                type="text"
                placeholder="vd: Nguyễn Văn X"
                value={queryParams.search}
                onChange={(e) => setQueryParams({ ...queryParams, search: e.target.value, page: 1 })}
                className="w-full h-11 pl-4 pr-4 rounded-xl bg-white border border-neutral-200 text-sm font-bold text-neutral-800 focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest ml-1">Chọn đơn vị</label>
            <select
              className="w-full h-11 px-4 rounded-xl bg-white border border-neutral-200 text-sm font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
              value={queryParams.role}
              onChange={(e) => setQueryParams({ ...queryParams, role: e.target.value, page: 1 })}
            >
              <option value="">Tất cả đơn vị</option>
              <option value={ROLES.STUDENT.role}>Học viên</option>
              <option value={ROLES.COMMANDER.role}>Chỉ huy</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-neutral-400 uppercase tracking-widest ml-1">Năm học</label>
            <select
              className="w-full h-11 px-4 rounded-xl bg-white border border-neutral-200 text-sm font-bold text-neutral-700 outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả năm học</option>
              <option value="2023-2024">2023 - 2024</option>
              <option value="2024-2025">2024 - 2025</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setQueryParams({ page: 1, limit: 10, search: "", role: ROLES.STUDENT.role })}
              className="h-11 px-6 flex items-center gap-2 bg-neutral-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-lg shadow-neutral-800/20"
            >
              <HiOutlineX size={16} />
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100/80">
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">STT</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest">HỌ VÀ TÊN</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">CẤP BẬC</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">ĐƠN VỊ</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">CHỨC VỤ</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">SỐ ĐIỆN THOẠI</th>
                <th className="px-6 py-5 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">TÙY CHỌN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-6 h-20 bg-neutral-50/10"></td>
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 text-neutral-300">
                      <HiOutlineUser size={56} className="opacity-10" />
                      <div className="space-y-1">
                        <p className="text-base font-black text-neutral-500 uppercase tracking-widest">Không có dữ liệu</p>
                        <p className="text-sm font-medium italic text-neutral-400">Không tìm thấy học viên nào</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.data.map((user, index) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-all group">
                    <td className="px-6 py-4 text-center text-xs font-bold text-neutral-400">
                      {(queryParams.page - 1) * queryParams.limit + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-primary-700 font-black overflow-hidden border border-white shrink-0">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-bold text-neutral-800">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-neutral-500">Học viên</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-neutral-500">Đại đội 1</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-neutral-500">Lớp trưởng</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-neutral-500">0123.456.789</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-all"
                        >
                          <HiOutlineLockClosed size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="relative">
          <Divide className="absolute top-0 left-0 w-full" />
          <div className="px-6 py-5 bg-neutral-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs font-bold text-neutral-500">
            <span>Hiển thị:</span>
            <select 
              className="bg-white border border-neutral-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500/10"
              value={queryParams.limit}
              onChange={(e) => setQueryParams({ ...queryParams, limit: Number(e.target.value), page: 1 })}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>học viên/trang</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-neutral-400">
              Trang {data?.pagination.page || 1} / {data?.pagination.totalPages || 1} ({data?.pagination.total || 0} học viên)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(data!.pagination.page - 1)}
                disabled={!data || data.pagination.page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(data!.pagination.page + 1)}
                disabled={!data || data.pagination.page === data.pagination.totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </AnimatedContainer>
  );
}
