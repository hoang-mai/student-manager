"use client";

import React from "react";
import { flexRender, Table as TanStackTable } from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";
import Divide from "@/library/Divide";
import Pagination, { PaginationProps } from "@/library/Pagination";

export interface TableProps<TData> {
  /** Đối tượng table được khởi tạo từ useReactTable */
  table: TanStackTable<TData>;
  /** Trạng thái đang tải dữ liệu */
  isLoading?: boolean;
  /** Văn bản hiển thị khi không có dữ liệu */
  emptyText?: string;
  /** Cấu hình phân trang */
  pagination?: PaginationProps;
  /** Class CSS bổ sung cho container của bảng */
  className?: string;
  /** Class CSS cho các hàng (tr) */
  rowClassName?: string;
}

const Table = <TData,>({
  table,
  isLoading = false,
  emptyText = "Không có dữ liệu hiển thị",
  pagination,
  className = "",
  rowClassName = "",
}: TableProps<TData>) => {
  return (
    <div
      className={`w-full rounded-2xl border border-neutral-100 overflow-hidden bg-white shadow-sm ${className}`}
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-neutral-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-4 text-xs font-black text-neutral-400 uppercase tracking-widest first:pl-8"
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 5 }).map((_, i) => (
                  <motion.tr
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="animate-pulse"
                  >
                    {table.getAllColumns().map((column, colIdx) => (
                      <td
                        key={`skeleton-td-${colIdx}`}
                        className="px-6 py-6 bg-white border-b border-neutral-50 first:pl-8 last:pr-8"
                      >
                        <div className="h-4 bg-neutral-100 rounded-lg w-full opacity-50" />
                      </td>
                    ))}
                  </motion.tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                // Empty state
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <td
                    colSpan={table.getAllColumns().length}
                    className="px-6 py-24 text-center bg-white"
                  >
                    <div className="flex flex-col items-center gap-4 text-neutral-300">
                      <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 opacity-20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-black text-neutral-500 uppercase tracking-widest">
                          {emptyText}
                        </p>
                        <p className="text-sm font-medium italic text-neutral-400">
                          Vui lòng kiểm tra lại bộ lọc hoặc dữ liệu đầu vào
                        </p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                // Data rows
                table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group transition-all duration-300 hover:bg-neutral-50/50 border-b border-neutral-100/50 ${rowClassName}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 first:pl-8">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <>
          <Divide className="w-full" />
          <Pagination
            pageIndex={pagination.pageIndex}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default Table;
