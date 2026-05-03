"use client";

import { motion } from "motion/react";
import { Table } from "@tanstack/react-table";

interface TableErrorStateProps<TData> {
  table: Table<TData>;
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * Component hiển thị trạng thái lỗi của bảng
 * Hỗ trợ nút thử lại để kích hoạt refetch
 */
const TableErrorState = <TData,>({
  table,
  error,
  onRetry,
}: TableErrorStateProps<TData>) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <td
        colSpan={table.getAllColumns().length}
        className="px-6 py-24 text-center bg-white"
      >
        <div className="flex flex-col items-center gap-4 text-red-500">
          {/* Icon Cảnh báo */}
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Thông tin lỗi */}
          <div className="space-y-1">
            <p className="text-base font-black uppercase tracking-widest">
              Đã có lỗi xảy ra
            </p>
            <p className="text-sm font-medium italic text-red-400">
              {error?.message || "Vui lòng kiểm tra kết nối mạng và thử lại"}
            </p>
          </div>

          {/* Nút Thử lại */}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 px-6 py-2 bg-red-50 text-red-600 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-red-100 transition-all border border-red-200 active:scale-95 shadow-sm"
            >
              Thử lại ngay
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

export default TableErrorState;
