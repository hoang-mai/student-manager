"use client";

import { useMemo, useState } from "react";
import type { ReactNode, Ref } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HiOutlineChevronDown,
  HiOutlineCheck,
  HiOutlineSearch,
} from "react-icons/hi";
import Dropdown from "@/library/Dropdown";
import Typography from "./Typography";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Skeleton from "@/library/Skeleton";
import { normalizeSearchText } from "@/utils/fn-common";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "outlined" | "filled";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectFilterConfig {
  /** Bật ô lọc trong dropdown */
  enabled: boolean;
  /** client: lọc options hiện có, server: parent tự gọi API rồi truyền lại options */
  mode: "client" | "server";
  /** Callback khi keyword thay đổi, dùng cho server-side filter */
  onChange?: (value: string) => void;
  /** Placeholder của ô lọc */
  placeholder?: string;
}

export interface SelectProps {
  /** Nhãn hiển thị phía trên ô select */
  label?: string;
  /** Thông báo lỗi hiển thị phía dưới ô select (nếu có) */
  error?: string;
  /** Kiểu hiển thị label: true (nằm đè lên viền) hoặc false (nằm phía trên) */
  floatingLabel?: boolean;
  /** Kích thước: sm, md, lg */
  size?: SelectSize;
  /** Kiểu hiển thị: outlined, filled */
  variant?: SelectVariant;
  /** Icon hiển thị ở phía bên trái */
  prefixIcon?: ReactNode;
  /** Có chiếm toàn bộ chiều ngang không */
  fullWidth?: boolean;
  /** Vô hiệu hóa */
  disabled?: boolean;
  /** Đang tải */
  isLoading?: boolean;
  /** Danh sách tùy chọn */
  options?: SelectOption[];
  /** Có trang tiếp theo không (cho infinite scroll) */
  hasNextPage?: boolean;
  /** Đang tải trang tiếp theo không */
  isFetchingNextPage?: boolean;
  /** Hàm callback để tải thêm dữ liệu */
  onLoadMore?: () => void;
  /** Giá trị của input */
  value?: string | number | null;
  /** Hàm callback trả về trực tiếp giá trị (thay vì event) */
  onChange?: (value: string | number) => void;
  /** Class CSS tùy chỉnh */
  className?: string;
  /** Chữ mờ khi chưa chọn */
  placeholder?: string;
  /** Số lượng mục tối đa hiển thị trước khi có thanh cuộn (mặc định: 5) */
  maxVisibleItems?: number;
  /** Có bắt buộc hay không */
  required?: boolean;
  /** Chữ hiển thị khi không có dữ liệu */
  emptyText?: string;
  /** Cấu hình lọc option trong dropdown */
  filter?: SelectFilterConfig;
  /** React 19: ref được truyền trực tiếp như prop, không cần forwardRef. */
  ref?: Ref<HTMLDivElement>;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

export default function Select({
  label,
  error,
  size = "md",
  variant = "outlined",
  prefixIcon,
  fullWidth = true,
  className = "",
  disabled,
  isLoading,
  floatingLabel = true,
  options = [],
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  value,
  onChange,
  placeholder = "Chọn...",
  maxVisibleItems = 5,
  required,
  emptyText,
  filter,
  ref,
}: SelectProps) {
  const baseStyles =
    "rounded-2xl transition-all duration-200 outline-none flex items-center justify-between cursor-pointer select-none font-medium";

  const variantStyles: Record<SelectVariant, string> = {
    outlined: `
        border-2 border-primary-200 bg-white
        text-neutral-900 hover:border-primary-400
      `,
    filled: `
        border border-transparent bg-neutral-50
        text-neutral-900 hover:bg-neutral-100
      `,
  };

  const errorStyles = error ? "!border-error-200 hover:!border-error-400" : "";
  const disabledStyles = disabled
    ? "!border-neutral-200 hover:!border-neutral-200 opacity-50 !cursor-not-allowed pointer-events-none"
    : "";

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const setSentinelRef = useInfiniteScroll({
    callback: onLoadMore || (() => { }),
    hasNextPage,
    isFetching: isFetchingNextPage,
    rootMargin: "20px",
  });

  return (
    <div
      className={`${fullWidth ? "w-full" : "inline-flex flex-col"} relative min-w-20 ${floatingLabel ? "mt-1.5" : ""}`}
      ref={ref}
    >
      {label && (
        <Typography
          as="label"
          variant={floatingLabel ? "caption" : "body"}
          weight={floatingLabel ? "bold" : "semibold"}
          color={error ? "error" : floatingLabel ? "gray" : "neutral"}
          className={
            floatingLabel
              ? "absolute -top-2 left-3 z-25 px-1 rounded-md bg-white cursor-text"
              : "block mb-1.5 ml-1"
          }
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
      )}

      <Dropdown
        align="left"
        className={fullWidth ? "w-full" : ""}
        targetY={0}
        fullwidth={true}
        disabled={disabled}
        isLoading={isLoading}
        dropdownClassName={(placement) => `
            bg-white border-2 border-primary-500 p-1.5
            ${placement === "bottom" ? "rounded-b-2xl rounded-t-none -mt-[2px]" : "rounded-t-2xl rounded-b-none -mb-[2px]"}
          `}
        trigger={(isOpen, placement) => (
          <div
            className={`
                ${baseStyles}
                ${sizeStyles[size]}
                ${variantStyles[variant]}
                ${fullWidth ? "w-full" : ""}
                ${errorStyles}
                ${disabledStyles}
                ${isOpen
                ? `border-primary-500! ring-4 ring-primary-500/10 z-20 relative
                   ${placement === "bottom" ? "rounded-b-none" : "rounded-t-none"}`
                : ""
              }
                ${className}
              `}
          >
            <div className="flex items-center gap-2 truncate">
              {prefixIcon && (
                <span className="text-neutral-400">{prefixIcon}</span>
              )}
              <span
                className={
                  !selectedOption ? "text-neutral-400" : "text-neutral-800"
                }
              >
                {displayValue}
              </span>
            </div>
            <HiOutlineChevronDown
              size={18}
              className={`text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        )}
      >
        {/*Nếu có filter thì sử dụng SelectFilter */}
        {filter?.enabled ? (
          <SelectFilter
            filter={filter}
            options={options}
            renderOptions={(visibleOptions) => (
              <SelectOptionsList
                visibleOptions={visibleOptions}
                value={value}
                maxVisibleItems={maxVisibleItems}
                emptyText={emptyText}
                isFetchingNextPage={isFetchingNextPage}
                setSentinelRef={setSentinelRef}
                onChange={onChange}
              />
            )}
          />
        ) : (
          <SelectOptionsList
            visibleOptions={options}
            value={value}
            maxVisibleItems={maxVisibleItems}
            emptyText={emptyText}
            isFetchingNextPage={isFetchingNextPage}
            setSentinelRef={setSentinelRef}
            onChange={onChange}
          />
        )}
      </Dropdown>

      <AnimatePresence>
        {error && (
          <motion.div
            key={error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 ml-1"
          >
            <Typography variant="caption" weight="medium" color="error">
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Props cho component danh sách lựa chọn */
interface SelectOptionsListProps {
  /** Danh sách các option hiển thị (sau khi đã lọc/phân trang) */
  visibleOptions: SelectOption[];
  /** Giá trị đang được chọn */
  value?: string | number | null;
  /** Số option tối đa hiển thị trước khi cuộn */
  maxVisibleItems: number;
  /** Văn bản hiển thị khi danh sách rỗng */
  emptyText?: string;
  /** Đang tải thêm trang tiếp theo (infinite scroll) */
  isFetchingNextPage?: boolean;
  /** Callback gán ref cho sentinel element dùng để trigger load thêm */
  setSentinelRef: (el: HTMLDivElement | null) => void;
  /** Callback khi người dùng chọn một option */
  onChange?: (value: string | number) => void;
}

function SelectOptionsList({
  visibleOptions,
  value,
  maxVisibleItems,
  emptyText,
  isFetchingNextPage,
  setSentinelRef,
  onChange,
}: SelectOptionsListProps) {
  return (
    <div
      style={{ maxHeight: `${maxVisibleItems * 40 + (maxVisibleItems - 1) * 4}px` }}
      className="overflow-auto custom-scrollbar"
    >
      <div className="flex flex-col gap-1 min-w-max">
        {visibleOptions.length > 0 ? (
          visibleOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => onChange?.(opt.value)}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all
                  ${isSelected ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}
                `}
              >
                <span >{opt.label}</span>
                {isSelected && (
                  <HiOutlineCheck
                    size={16}
                    className="text-primary-600 shrink-0 ml-2"
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="p-3 text-center text-neutral-400 text-sm">
            {emptyText || "Không tìm thấy dữ liệu"}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div ref={setSentinelRef} className="h-0" />

        {isFetchingNextPage && (
          <div className="flex flex-col gap-1 p-1">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center px-3 py-2">
                <Skeleton width={120} height={16} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Props cho component bộ lọc tìm kiếm trong Select */
interface SelectFilterProps {
  /** Cấu hình bộ lọc (placeholder, debounce, fetch...) */
  filter: SelectFilterConfig;
  /** Toàn bộ danh sách option trước khi lọc */
  options: SelectOption[];
  /** Hàm render danh sách option sau khi đã được lọc */
  renderOptions: (visibleOptions: SelectOption[]) => ReactNode;
}

function SelectFilter({ filter, options, renderOptions }: SelectFilterProps) {
  const [filterValue, setFilterValue] = useState("");

  const visibleOptions = useMemo(() => {
    const keyword = normalizeSearchText(filterValue.trim());
    if (filter.mode !== "client" || !keyword) return options;

    return options
      .map((option) => ({
        option,
        rank: rankItem(normalizeSearchText(option.label), keyword),
      }))
      .filter(({ rank }) => rank.passed)
      .sort((a, b) => compareItems(a.rank, b.rank))
      .map(({ option }) => option);
  }, [filter.mode, filterValue, options]);

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    if (filter.mode === "server") filter.onChange?.(value.trim());
  };

  return (
    <div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-1"
      >
        <div className="relative">
          <HiOutlineSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            value={filterValue}
            onChange={(e) => handleFilterChange(e.target.value)}
            placeholder={filter.placeholder ?? "Tìm kiếm..."}
            className="h-9 w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-3 text-sm font-semibold text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-500"
          />
        </div>
      </div>
      {renderOptions(visibleOptions)}
    </div>
  );
}
