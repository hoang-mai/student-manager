"use client";

import type { ReactNode } from "react";
import { flexRender } from "@tanstack/react-table";
import type { Row, Table as TableInstance } from "@tanstack/react-table";
import { motion, AnimatePresence } from "motion/react";
import TableEmptyState from "./TableEmptyState";

interface TableBodyProps<TData> {
  /** Instance của TanStack table */
  table: TableInstance<TData>;
  /** Văn bản hiển thị khi không có dữ liệu */
  emptyText: string;
  /** Class CSS tùy chỉnh cho hàng */
  rowClassName: string;
  /** Render hàng group row, nếu không có trả về row */
  renderGroupRow?: (row: Row<TData>) => ReactNode;
}

const TableBody = <TData,>({
  table,
  emptyText,
  rowClassName,
  renderGroupRow,
}: TableBodyProps<TData>) => {
  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  return (
    <AnimatePresence>
      {rows.length === 0 ? (
        <TableEmptyState table={table} emptyText={emptyText} />
      ) : (
        rows.map((row) => {
          const groupContent = renderGroupRow?.(row);
          const hasGroupContent =
            groupContent !== undefined &&
            groupContent !== null &&
            groupContent !== false;

          if (hasGroupContent) {
            return (
              <motion.tr
                key={row.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-b border-neutral-100/70"
              >
                <td colSpan={visibleColumnCount} className="p-0">
                  {groupContent}
                </td>
              </motion.tr>
            );
          }

          return (
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
                  className={`p-4 ${row.depth > 0 ? "first:pl-12" : "first:pl-8"}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </motion.td>
              ))}
            </motion.tr>
          );
        })
      )}
    </AnimatePresence>
  );
};

export default TableBody;
