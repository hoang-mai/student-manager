"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  VisibilityState,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { DragDropProvider, DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import Divide from "@/library/Divide";
import Pagination from "@/library/Pagination";
import TableHeader from "./table/TableHeader";
import TableToolbar from "./table/TableToolbar";
import TableSkeleton from "./table/TableSkeleton";
import TableBody from "./table/TableBody";
import TableErrorState from "./table/TableErrorState";
import { DEFAULT_PAGE } from "@/constants/constants";
import { FilterField } from "./table/TableFilter";

export interface TableProps<TData, TParams = Record<string, unknown>> {
  /** Hàm gọi API lấy dữ liệu */
  fetchData: (params: TParams) => Promise<PaginatedResponse<TData>>;
  /** Định nghĩa các cột */
  columns: ColumnDef<TData>[];
  /** Key để cache dữ liệu trong React Query */
  queryKey: string[];
  /** Hiển thị cột số thứ tự (mặc định: true) */
  showIndex?: boolean;
  /** Hiển thị nút tùy chỉnh ẩn hiện cột (mặc định: true) */
  showVisibilityToggle?: boolean;
  /** Cấu hình các trường lọc */
  filterFields?: FilterField[];
  /** Hiển thị bộ lọc (mặc định: true nếu có filterFields) */
  showFilter?: boolean;
  /** Văn bản hiển thị khi không có dữ liệu */
  emptyText?: string;
  /** Class CSS bổ sung cho container của bảng */
  className?: string;
  /** Class CSS cho các hàng (tr) */
  rowClassName?: string;
  /** Callback khi bấm nút thêm (nếu có sẽ hiện nút thêm) */
  onAdd?: () => void;
  /** Nhãn cho nút thêm */
  addLabel?: string;
}

const Table = <TData, TParams = Record<string, unknown>>({
  fetchData,
  columns: userColumns,
  queryKey,
  showIndex = true,
  filterFields,
  showFilter = true,
  emptyText = "Không có dữ liệu hiển thị",
  className = "",
  rowClassName = "",
  onAdd,
  addLabel,
}: TableProps<TData, TParams>) => {
  const [pagination, setPagination] = useState({
    pageIndex: DEFAULT_PAGE.PAGE_INDEX,
    pageSize: DEFAULT_PAGE.PAGE_SIZE,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKey, pagination, columnFilters, sorting],
    queryFn: async () => {
      const filterParams = columnFilters.reduce(
        (acc, filter) => {
          acc[filter.id] = filter.value;
          return acc;
        },
        {} as Record<string, unknown>
      );

      const sortParams: Record<string, string> = {};
      if (sorting.length > 0) {
        sortParams.sortBy = sorting[0].id;
        sortParams.sortOrder = sorting[0].desc ? "desc" : "asc";
      }

      return fetchData({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        ...filterParams,
        ...sortParams,
      } as TParams);
    },
    placeholderData: keepPreviousData,
  });

  const displayData = useMemo(() => data?.data || [], [data]);
  const totalPages = useMemo(() => data?.pagination?.totalPages || 1, [data]);

  const finalColumns = useMemo<ColumnDef<TData>[]>(() => {
    if (!showIndex) return userColumns;

    const indexColumn: ColumnDef<TData> = {
      id: "stt",
      header: "STT",
      size: 70,
      enableSorting: false,
      cell: (info) => {
        return (
          <span className="text-xs font-bold text-neutral-400">
            {pagination.pageIndex * pagination.pageSize + info.row.index + 1}
          </span>
        );
      },
    };

    return [indexColumn, ...userColumns];
  }, [showIndex, userColumns, pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: displayData,
    columns: finalColumns,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableMultiSort: false,
    state: {
      pagination,
      columnOrder,
      columnVisibility,
      columnFilters,
      sorting,
    },
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { canceled, source } = event.operation;

      if (canceled) return;

      if (isSortable(source)) {
        const { initialIndex, index } = source;
        if (initialIndex !== index) {
          const currentOrder =
            table.getState().columnOrder.length > 0
              ? [...table.getState().columnOrder]
              : table.getAllLeafColumns().map((col) => col.id);

          const [removed] = currentOrder.splice(initialIndex, 1);
          currentOrder.splice(index, 0, removed);
          table.setColumnOrder(currentOrder);
        }
      }
    },
    [table]
  );

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage - 1,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 0,
    }));
  };

  return (
    <div className="space-y-4">
      {/* table Toolbar */}
      <TableToolbar
        table={table}
        filterFields={filterFields}
        showFilter={showFilter}
        isLoading={isLoading}
        onAdd={onAdd}
        addLabel={addLabel}
      />

      <DragDropProvider onDragEnd={handleDragEnd}>
        <div
          className={`w-full rounded-2xl border border-neutral-100 overflow-hidden bg-white shadow-sm ${className}`}
        >
          <div className="overflow-x-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-50/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <TableHeader
                        key={header.id}
                        header={header}
                        index={index}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {isLoading ? (
                  <TableSkeleton table={table} />
                ) : isError ? (
                  <TableErrorState 
                    table={table} 
                    error={error} 
                    onRetry={() => refetch()} 
                  />
                ) : (
                  <TableBody
                    table={table}
                    emptyText={emptyText}
                    rowClassName={rowClassName}
                  />
                )}
              </tbody>
            </table>
          </div>

          <Divide className="w-full" />
          <Pagination
            pageIndex={pagination.pageIndex + 1}
            totalPages={totalPages}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </DragDropProvider>
    </div>
  );
};

export default Table;
