"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { HiOutlineAdjustments } from "react-icons/hi";

interface TableToolbarProps<TData> {
  table: Table<TData>;
}

const TableToolbar = <TData,>({ table }: TableToolbarProps<TData>) => {
  return (
    <div className="flex justify-end px-2">
      <div className="relative group/visibility">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-[11px] font-black uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm">
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
  );
};

export default TableToolbar;
