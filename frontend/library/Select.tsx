"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineChevronDown, HiOutlineCheck } from "react-icons/hi";
import Dropdown from "@/library/Dropdown";
import Typography from "./Typography";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import Skeleton from "@/library/Skeleton";
type SelectSize = "sm" | "md" | "lg";
type SelectVariant = "outlined" | "filled";

export interface SelectOption {
  value: string | number;
  label: string;
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
  prefixIcon?: React.ReactNode;
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
}

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
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
    },
    ref
  ) => {
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

    const errorStyles = error
      ? "!border-error-200 hover:!border-error-400"
      : "";
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
          <div
            style={{ maxHeight: `${maxVisibleItems * 40}px` }}
            className="overflow-y-auto custom-scrollbar flex flex-col gap-1"
          >
            {options && options.length > 0 ? (
              options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => onChange && onChange(opt.value)}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all
                      ${isSelected ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <HiOutlineCheck
                        size={16}
                        className="text-primary-600 shrink-0"
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-neutral-400 text-sm">
                {emptyText || "Không có dữ liệu"}
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            <div ref={setSentinelRef} className="h-1" />

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
);

Select.displayName = "Select";

export default Select;
