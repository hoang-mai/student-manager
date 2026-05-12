"use client";

import { motion, AnimatePresence } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { ColumnFiltersState, Table } from "@tanstack/react-table";
import {
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineHashtag,
} from "react-icons/hi";
import Input from "@/library/Input";
import Select, { SelectOption } from "@/library/Select";
import Button from "@/library/Button";

export type FilterFieldType = "text" | "select" | "number" | "date";

export interface FilterField {
  /** Loại input: text, select, number, date */
  type: FilterFieldType;
  /** Id định danh cho trường lọc */
  id: string;
  /** Nhãn hiển thị của trường lọc */
  label: string;
  /** Các tùy chọn nếu type là 'select' */
  options?: SelectOption[];
  /** Gợi ý nhập liệu */
  placeholder?: string;
  /** Có đang tải dữ liệu lần đầu không */
  isLoading?: boolean;
  /** Có trang tiếp theo không (cho infinite scroll) */
  hasNextPage?: boolean;
  /** Đang tải trang tiếp theo không */
  isFetchingNextPage?: boolean;
  /** Hàm callback để tải thêm dữ liệu */
  onLoadMore?: () => void;
}

interface TableFilterProps<TData> {
  /** Thao tác với bảng */
  table: Table<TData>;
  /** Cấu hình các trường lọc */
  fields: FilterField[];
  /** Mở/Đóng bộ lọc */
  isOpen?: boolean;
}

const TableFilter = <TData,>({
  table,
  fields,
  isOpen = false,
}: TableFilterProps<TData>) => {
  const { control, handleSubmit, reset, register } =
    useForm<Record<string, string | number>>();

  const onSubmit = (data: Record<string, string | number>) => {
    const newFilters: ColumnFiltersState = Object.entries(data)
      .filter(
        ([, value]) => value !== "" && value !== undefined && value !== null
      )
      .map(([id, value]) => ({ id, value }));

    table.setColumnFilters(newFilters);
  };

  const handleReset = () => {
    reset();
    table.resetColumnFilters();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fields.map((field) => {
                const Icon =
                  field.type === "date"
                    ? HiOutlineCalendar
                    : field.type === "number"
                      ? HiOutlineHashtag
                      : HiOutlineSearch;
                return (
                  <div key={field.id}>
                    {field.type === "select" ? (
                      <Controller
                        name={field.id}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            label={field.label}
                            value={value}
                            onChange={onChange}
                            options={field.options}
                            placeholder={field.placeholder}
                            prefixIcon={<HiOutlineTag size={16} />}
                            hasNextPage={field.hasNextPage}
                            isFetchingNextPage={field.isFetchingNextPage}
                            onLoadMore={field.onLoadMore}
                            isLoading={field.isLoading}
                          />
                        )}
                      />
                    ) : (
                      <Input
                        {...register(field.id)}
                        id={field.id}
                        type={field.type}
                        label={field.label}
                        placeholder={field.placeholder}
                        prefixIcon={<Icon size={16} />}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={HiOutlineRefresh}
                onClick={handleReset}
                className="text-[10px] font-black uppercase tracking-wider"
              >
                Làm mới
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                icon={HiOutlineSearch}
                className="text-[10px] font-black uppercase tracking-wider"
              >
                Tìm kiếm
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableFilter;
