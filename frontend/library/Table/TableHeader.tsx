"use client";

import { Header, flexRender } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/react/sortable";

interface HeaderProps<TData> {
  header: Header<TData, unknown>;
  index: number;
}

const TableHeader = <TData,>({
  header,
  index,
}: HeaderProps<TData>) => {
  const { ref, handleRef, isDragSource } = useSortable({
    id: header.column.id,
    index,
  });

  return (
    <th
      ref={ref}
      colSpan={header.colSpan}
      className={`p-4 text-xs font-black text-neutral-400 uppercase tracking-widest first:pl-8 transition-colors
        ${isDragSource ? "bg-primary-50/80 opacity-60" : "hover:bg-neutral-50/50"}
      `}
    >
      {header.isPlaceholder ? null : (
        <div className="flex items-center gap-2">
          <div
            ref={handleRef}
            className={`flex items-center gap-2 ${
              header.column.getCanSort()
                ? "cursor-pointer select-none group/sort hover:text-neutral-600 transition-colors"
                : ""
            }`}
            onClick={header.column.getToggleSortingHandler()}
          >
            <span>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>

            {header.column.getCanSort() && (
              <div className="flex flex-col shrink-0">
                <svg
                  className={`w-2.5 h-2.5 -mb-0.5 transition-all ${
                    header.column.getIsSorted() === "asc"
                      ? "text-primary-600 opacity-100"
                      : "text-neutral-300 opacity-50 group-hover/sort:opacity-100"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                <svg
                  className={`w-2.5 h-2.5 -mt-0.5 transition-all ${
                    header.column.getIsSorted() === "desc"
                      ? "text-primary-600 opacity-100"
                      : "text-neutral-300 opacity-50 group-hover/sort:opacity-100"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </th>
  );
};

export default TableHeader;
