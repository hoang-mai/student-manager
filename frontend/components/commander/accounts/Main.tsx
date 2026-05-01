"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { userService } from "@/services/user";
import { UserQueryParams } from "@/types/user";
import { User } from "@/types/auth";
import { ROLES } from "@/constants/constants";
import { MOCK_USERS } from "@/constants/mockUsers";
import AnimatedContainer from "@/library/AnimatedContainer";
import Button from "@/library/Button";
import Divide from "@/library/Divide";
import Table from "@/library/Table";
import Select from "@/library/Select";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineLockClosed,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineDownload,
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

  // Cấu trúc cột cho Table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "STT",
        cell: (info) => {
          const index = info.row.index;
          return ((queryParams.page ?? 1) - 1) * (queryParams.limit ?? 10) + index + 1;
        },
        size: 80,
      },
      {
        header: "Học viên",
        accessorKey: "fullName",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700 font-black overflow-hidden border border-white shadow-sm shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-neutral-800 uppercase tracking-tight leading-tight">{user.fullName}</span>
                <span className="text-[11px] font-bold text-neutral-400 italic">Mã HV: 202400{user.id}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: "Cấp bậc",
        accessorKey: "rank",
        cell: () => <span className="text-xs font-bold text-neutral-500">Học viên</span>
      },
      {
        header: "Đơn vị",
        accessorKey: "unit",
        cell: () => <span className="text-xs font-bold text-neutral-500">Đại đội 1</span>
      },
      {
        header: "Chức vụ",
        accessorKey: "position",
        cell: () => <span className="text-xs font-bold text-neutral-500">Lớp trưởng</span>
      },
      {
        header: "Số điện thoại",
        accessorKey: "phone",
        cell: () => <span className="text-xs font-bold text-neutral-500 italic">0123.456.789</span>
      },
      {
        header: "Hành động",
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleOpenModal(user)}
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <HiOutlinePencil size={18} />
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-xl transition-all"
              >
                <HiOutlineLockClosed size={18} />
              </button>
            </div>
          );
        },
      },
    ],
    [queryParams]
  );

  // Tính toán dữ liệu hiển thị (phân trang local nếu không có data từ API)
  const displayData = useMemo(() => {
    if (data?.data) return data.data;
    const start = ((queryParams.page || 1) - 1) * (queryParams.limit || 10);
    const end = start + (queryParams.limit || 10);
    return MOCK_USERS.slice(start, end);
  }, [data, queryParams]);

  const totalPages = data?.pagination?.totalPages || Math.ceil(MOCK_USERS.length / (queryParams.limit || 10));
  const totalItems = data?.pagination?.total || MOCK_USERS.length;

  // Khởi tạo table instance
  const table = useReactTable({
    data: displayData,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: (queryParams.page || 1) - 1,
        pageSize: queryParams.limit || 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
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

  const handleOpenModal = (user: User | null = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (selectedUser) {
      updateMutation.mutate({ id: Number(selectedUser.id), data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams({ ...queryParams, page: newPage });
  };

  return (
    <AnimatedContainer variant="slideUp" className="space-y-8 relative rounded-2xl bg-white p-4">

      <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
        <HiOutlineHome size={14} className="mb-0.5" />
        <span>Trang chủ</span>
        <HiOutlineChevronRight size={12} />
        <span className="text-primary-600">Danh sách học viên</span>
      </div>

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

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-900/5 border border-neutral-100 overflow-hidden relative">
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Tìm kiếm học viên</label>
              <input
                type="text"
                placeholder="Nhập tên học viên..."
                value={queryParams.search}
                onChange={(e) => setQueryParams({ ...queryParams, search: e.target.value, page: 1 })}
                className="w-full h-12 pl-4 pr-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-sm font-bold text-neutral-800 focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/30 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Đơn vị quản lý</label>
              <Select
                size="lg"
                label="Đơn vị "
                value={queryParams.role}
                onChange={(value) => setQueryParams({ ...queryParams, role: String(value), page: 1 })}
                options={[
                  { value: "", label: "Tất cả đơn vị" },
                  { value: ROLES.STUDENT.role, label: "Học viên" },
                  { value: ROLES.COMMANDER.role, label: "Chỉ huy" }
                ]}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] ml-1">Năm học hiện tại</label>
              <select className="w-full h-12 px-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 text-sm font-bold text-neutral-700 outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500/30 focus:bg-white transition-all appearance-none cursor-pointer">
                <option value="">Tất cả năm học</option>
                <option value="2023-2024">2023 - 2024</option>
                <option value="2024-2025">2024 - 2025</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setQueryParams({ page: 1, limit: 10, search: "", role: ROLES.STUDENT.role })}
                className="h-12 flex-1 flex items-center justify-center gap-2 bg-neutral-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-lg shadow-neutral-800/10 active:scale-95"
              >
                <HiOutlineX size={16} />
                Làm mới bộ lọc
              </button>
            </div>
          </div>
        </div>

        <Divide className="w-full" />

        {/* Table Area */}
        <div className="px-4">
          <Table
            table={table}
            isLoading={isLoading}
            emptyText="Không tìm thấy học viên nào phù hợp"
            pagination={{
              page: data?.pagination.page || 1,
              totalPages: data?.pagination.totalPages || 1,
              total: data?.pagination.total || 0,
              limit: queryParams.limit || 10,
              itemName: "học viên",
              onPageChange: handlePageChange,
              onLimitChange: (limit) => setQueryParams({ ...queryParams, limit, page: 1 })
            }}
          />
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
