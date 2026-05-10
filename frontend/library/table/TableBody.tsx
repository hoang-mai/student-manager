"use client";

import { flexRender, Table as TableInstance } from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";
import TableEmptyState from "./TableEmptyState";

interface TableBodyProps<TData> {
  /** Instance của TanStack table */
  table: TableInstance<TData>;
  /** Văn bản hiển thị khi không có dữ liệu */
  emptyText: string;
  /** Class CSS tùy chỉnh cho hàng */
  rowClassName: string;
}

const TableBody = <TData,>({
  table,
  emptyText,
  rowClassName,
}: TableBodyProps<TData>) => {
  return (
    <AnimatePresence>
      {table.getRowModel().rows.length === 0 ? (
        <TableEmptyState table={table} emptyText={emptyText} />
      ) : (
        table.getRowModel().rows.map((row) => (
          <motion.tr
            key={row.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`group hover:bg-neutral-50/50 border-b border-neutral-100/50 ${rowClassName}`}
          >
            {row.getVisibleCells().map((cell) => (
              <motion.td
                key={cell.id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="p-4 first:pl-8"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </motion.td>
            ))}
          </motion.tr>
        ))
      )}
    </AnimatePresence>
  );
};

export default TableBody;
