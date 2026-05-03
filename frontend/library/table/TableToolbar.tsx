"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { HiOutlineAdjustments, HiOutlineFilter, HiOutlinePlus } from "react-icons/hi";
import TableFilter, { FilterField } from "./TableFilter";

interface TableToolbarProps<TData> {
  /** Thao tác với bảng từ TanStack table */
  table: Table<TData>;
  /** Cấu hình các trường lọc */
  filterFields?: FilterField[];
  /** Hiển thị bộ lọc (mặc định: true nếu có filterFields) */
  showFilter?: boolean;
  /** Trạng thái loading */
  isLoading?: boolean;
  /** Callback khi bấm nút thêm */
  onAdd?: () => void;
  /** Nhãn cho nút thêm */
  addLabel?: string;
}

const TableToolbar = <TData,>({
  table,
  filterFields,
  showFilter = true,
  isLoading = false,
  onAdd,
  addLabel,
}: TableToolbarProps<TData>) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex flex-col px-2">
      <div className="flex flex-row items-center justify-end gap-2 mb-4">
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-primary-600 rounded-xl text-[11px] font-black uppercase tracking-wider text-white hover:bg-primary-700 hover:border-primary-700 transition-all shadow-lg shadow-primary-600/20 cursor-pointer active:scale-95"
          >
            <HiOutlinePlus size={16} />
            {addLabel || "Thêm mới"}
          </button>
        )}

        {showFilter && filterFields && filterFields.length > 0 && (
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-sm border cursor-pointer ${
              isFilterOpen
                ? "bg-primary-50 border-primary-200 text-primary-600"
                : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <HiOutlineFilter
              size={16}
              className={isFilterOpen ? "text-primary-500" : "text-neutral-400"}
            />
            Bộ lọc
          </button>
        )}

        <div className="relative group/visibility self-start">
          <button className=" cursor-pointer flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm">
            <HiOutlineAdjustments size={16} className="text-neutral-400" />
            Cột hiển thị
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-neutral-100 rounded-2xl shadow-2xl shadow-neutral-200/50 p-2 opacity-0 invisible group-hover/visibility:opacity-100 group-hover/visibility:visible transition-all z-50 transform origin-top-right group-hover/visibility:translate-y-0 translate-y-2">
            <div className="px-3 py-2 border-b border-neutral-50 mb-1">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Tùy chỉnh hiển thị
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-0.5 px-1">
              {table.getAllLeafColumns().map((column) => {
                if (column.id === "stt" || column.id === "actions") return null;
                return (
                  <label
                    key={column.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors group/item"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="peer appearance-none w-5 h-5 border-2 border-neutral-100 rounded-lg checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer"
                      />
                      <svg
                        className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-neutral-600 group-hover/item:text-neutral-900 transition-colors capitalize">
                      {typeof column.columnDef.header === "string"
                        ? column.columnDef.header
                        : column.id}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showFilter && filterFields && filterFields.length > 0 && (
        <TableFilter
          table={table}
          fields={filterFields}
          isOpen={isFilterOpen}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default TableToolbar;
