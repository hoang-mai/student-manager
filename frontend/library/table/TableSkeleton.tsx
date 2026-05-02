"use client";

import React from "react";
import { motion } from "motion/react";
import { Table } from "@tanstack/react-table";
import { DEFAULT_PAGE } from "@/constants/constants";

interface TableSkeletonProps<TData> {
  table: Table<TData>;
}

const TableSkeleton = <TData,>({ table }: TableSkeletonProps<TData>) => {
  return (
    <>
      {Array.from({ length: DEFAULT_PAGE.PAGE_SIZE }).map((_, i) => (
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
      ))}
    </>
  );
};

export default TableSkeleton;
