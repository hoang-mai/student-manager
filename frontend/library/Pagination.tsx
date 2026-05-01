"use client";

import React from "react";
import {
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";

import Select from "@/library/Select";

export interface PaginationProps {
  /** Trang hiện tại (bắt đầu từ 1) */
  page: number;
  /** Tổng số trang */
  totalPages: number;
  /** Số lượng bản ghi trên mỗi trang */
  limit: number;
  /** Hàm xử lý khi thay đổi trang */
  onPageChange: (page: number) => void;
  /** Hàm xử lý khi thay đổi số lượng hiển thị trên mỗi trang */
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const getPages = () => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-3 bg-neutral-50/50">
      {/* Phần chọn số lượng hiển thị */}
      <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 justify-start">
        <div className="text-neutral-400 uppercase tracking-widest text-[10px] flex-1">
          Số hàng mỗi trang
        </div>
        <Select
          size="sm"
          className="font-black"
          value={limit}
          fullWidth={false}
          onChange={(value) => onLimitChange(Number(value))}
          options={[
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
            { value: 100, label: "100" },
          ]}
        />
      </div>

      {/* Phần điều hướng trang */}
      <div className="flex items-center gap-2">
        {/* Nút về đầu */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Trang đầu"
        >
          <HiOutlineChevronDoubleLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <HiOutlineChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <PageButton
              key={p}
              num={p}
              active={p === page}
              onClick={onPageChange}
            />
          ))}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer "
        >
          <HiOutlineChevronRight size={16} />
        </button>

        {/* Nút đến cuối */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Trang cuối"
        >
          <HiOutlineChevronDoubleRight size={16} />
        </button>

        <div className="hidden lg:block ml-4 text-xs font-bold text-neutral-400 uppercase tracking-[0.2em]">
          {page} / {totalPages}
        </div>
      </div>
    </div>
  );
};

interface PageButtonProps {
  num: number;
  active: boolean;
  onClick: (p: number) => void;
}

const PageButton: React.FC<PageButtonProps> = ({ num, active, onClick }) => (
  <button
    onClick={() => onClick(num)}
    className={`
      w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer
      ${
        active
          ? "bg-primary-600 text-white font-semibold"
          : "text-neutral-600 hover:bg-neutral-50 border border-transparent hover:border-neutral-200"
      }
    `}
  >
    {num}
  </button>
);

export default Pagination;
