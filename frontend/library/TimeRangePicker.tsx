"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineClock, HiOutlineChevronDown } from "react-icons/hi";
import Button from "./Button";
import Popover from "./Popover";
import Typography from "./Typography";

type TimeMode = "HH" | "HH:mm" | "HH:mm:ss";
type InputSize = "sm" | "md" | "lg";

export interface TimeRangeValue {
  startTime?: string;
  endTime?: string;
}

export interface TimeRangePickerProps {
  /** Nhãn hiển thị phía trên (floating label) */
  label?: string;
  /** Giá trị khoảng thời gian */
  value?: TimeRangeValue;
  /** Callback khi khoảng thời gian thay đổi (chỉ kích hoạt khi bấm Xác nhận) */
  onChange?: (value: TimeRangeValue) => void;
  /** Chế độ nhập: "HH" (chỉ giờ), "HH:mm" (giờ:phút), "HH:mm:ss" (giờ:phút:giây) */
  mode?: TimeMode;
  /** Thông báo lỗi hiển thị phía dưới */
  error?: string;
  /** Kích thước: sm, md, lg */
  size?: InputSize;
  /** Có chiếm toàn bộ chiều ngang không */
  fullWidth?: boolean;
  /** Vô hiệu hóa tương tác */
  disabled?: boolean;
  /** Trạng thái đang tải (vô hiệu hóa tương tác) */
  isLoading?: boolean;
  /** Hiển thị dấu * bắt buộc */
  required?: boolean;
  /** Chữ mờ khi chưa chọn */
  placeholder?: string;
  /** React 19: ref truyền trực tiếp */
  ref?: Ref<HTMLDivElement>;
}

const SEPARATOR = " - ";

const placeholders: Record<TimeMode, string> = {
  HH: "HH",
  "HH:mm": "HH:mm",
  "HH:mm:ss": "HH:mm:ss",
};

const sizeStyles: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const seconds = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

function parseTime(
  value: string,
  mode: TimeMode
): { h: string; m: string; s: string } {
  const parts = value.split(":");
  return {
    h: parts[0] || "",
    m: mode !== "HH" ? parts[1] || "" : "",
    s: mode === "HH:mm:ss" ? parts[2] || "" : "",
  };
}

function buildTime(h: string, m: string, s: string, mode: TimeMode): string {
  if (!h) return "";
  if (mode === "HH") return h;
  if (mode === "HH:mm") return `${h}:${m || "00"}`;
  return `${h}:${m || "00"}:${s || "00"}`;
}

function formatDisplay(value: string | undefined, mode: TimeMode): string {
  if (!value) return placeholders[mode];
  return value;
}

interface TimeColumnProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
}

function TimeColumn({ items, selected, onSelect }: TimeColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedRef.current && containerRef.current) {
      selectedRef.current.scrollIntoView({
        block: "center",
        behavior: "instant",
      });
    }
  }, [selected]);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-48 overflow-y-auto custom-scrollbar"
    >
      <div className="flex flex-col gap-0.5 p-1">
        {items.map((item) => (
          <button
            key={item}
            ref={item === selected ? selectedRef : undefined}
            type="button"
            onClick={() => onSelect(item)}
            className={`
              px-2 py-1.5 rounded-lg text-xs font-bold text-center transition-all cursor-pointer
              ${
                item === selected
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/40 hover:text-primary-600 dark:hover:text-primary-300"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TimePanelProps {
  value: string;
  onChange: (value: string) => void;
  mode: TimeMode;
  label: string;
}

function TimePanel({ value, onChange, mode, label }: TimePanelProps) {
  const { h, m, s } = parseTime(value, mode);

  const handleHourSelect = (hour: string) => {
    onChange(buildTime(hour, m, s, mode));
  };

  const handleMinuteSelect = (minute: string) => {
    onChange(buildTime(h || "00", minute, s, mode));
  };

  const handleSecondSelect = (second: string) => {
    onChange(buildTime(h || "00", m || "00", second, mode));
  };

  return (
    <div className="flex-1">
      <Typography
        variant="caption"
        weight="bold"
        color="gray"
        className="mb-2 block text-center"
      >
        {label}
      </Typography>
      <div className="flex gap-0.5 rounded-xl border border-neutral-100 dark:border-neutral-700/80 overflow-hidden">
        <TimeColumn items={hours} selected={h} onSelect={handleHourSelect} />
        {mode !== "HH" && (
          <TimeColumn
            items={minutes}
            selected={m}
            onSelect={handleMinuteSelect}
          />
        )}
        {mode === "HH:mm:ss" && (
          <TimeColumn
            items={seconds}
            selected={s}
            onSelect={handleSecondSelect}
          />
        )}
      </div>
    </div>
  );
}

export default function TimeRangePicker({
  label,
  value,
  onChange,
  mode = "HH:mm",
  error,
  size = "md",
  fullWidth = true,
  disabled = false,
  isLoading = false,
  required,
  placeholder,
  ref,
}: TimeRangePickerProps) {
  const startValue = value?.startTime ?? "";
  const endValue = value?.endTime ?? "";

  const [draftStart, setDraftStart] = useState(startValue);
  const [draftEnd, setDraftEnd] = useState(endValue);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setDraftStart(startValue);
      setDraftEnd(endValue);
    }
  };

  const displayPlaceholder =
    placeholder || `${placeholders[mode]}${SEPARATOR}${placeholders[mode]}`;
  const displayText =
    startValue || endValue
      ? `${formatDisplay(startValue, mode)}${SEPARATOR}${formatDisplay(endValue, mode)}`
      : "";

  const errorStyles = error ? "!border-error-200 hover:!border-error-400" : "";
  const disabledStyles =
    disabled || isLoading
      ? "!border-neutral-200 dark:!border-neutral-800 hover:!border-neutral-200 dark:hover:!border-neutral-800 opacity-50 !cursor-not-allowed pointer-events-none"
      : "";

  return (
    <div
      ref={ref}
      className={`${fullWidth ? "w-full" : "inline-flex flex-col"} relative min-w-40 mt-1.5`}
    >
      {label && (
        <Typography
          as="label"
          variant="caption"
          weight="bold"
          color={error ? "error" : "gray"}
          className="absolute -top-2 left-3 z-25 px-1 rounded-md bg-white dark:bg-neutral-950 cursor-text"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Typography>
      )}

      <Popover
        align="left"
        className={fullWidth ? "w-full" : ""}
        targetY={8}
        disabled={disabled}
        isLoading={isLoading}
        onOpenChange={handleOpenChange}
        popoverClassName="w-80 bg-white dark:bg-neutral-950 border-2 border-primary-500 dark:border-neutral-700 p-4 rounded-2xl shadow-xl dark:shadow-black/40 z-50"
        trigger={(isOpen) => (
          <div
            className={`
              rounded-2xl transition-all duration-200 outline-none flex items-center justify-between cursor-pointer select-none font-medium
              border-2 border-primary-200 dark:border-neutral-700 bg-white dark:bg-neutral-950
              text-neutral-900 dark:text-neutral-100 hover:border-primary-400 dark:hover:border-neutral-500
              ${sizeStyles[size]}
              ${fullWidth ? "w-full" : ""}
              ${errorStyles}
              ${disabledStyles}
              ${isOpen ? "border-primary-500! ring-4 ring-primary-500/10 z-20 relative" : ""}
            `}
          >
            <div className="flex items-center gap-2 truncate">
              <HiOutlineClock size={18} className="text-neutral-400 shrink-0" />
              <span
                className={
                  !displayText
                    ? "text-neutral-400 dark:text-neutral-500"
                    : "text-neutral-800 dark:text-neutral-100"
                }
              >
                {displayText || displayPlaceholder}
              </span>
            </div>
            <HiOutlineChevronDown
              size={16}
              className={`text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        )}
      >
        {({ close }) => (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <TimePanel
                value={draftStart}
                onChange={setDraftStart}
                mode={mode}
                label="Bắt đầu"
              />
              <TimePanel
                value={draftEnd}
                onChange={setDraftEnd}
                mode={mode}
                label="Kết thúc"
              />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setDraftStart("");
                  setDraftEnd("");
                }}
                className="text-xs font-bold text-neutral-400 dark:text-neutral-500 hover:text-error-500 cursor-pointer"
              >
                Xóa chọn
              </button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={close}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onChange?.({
                      startTime: draftStart,
                      endTime: draftEnd,
                    });
                    close();
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}
      </Popover>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key={error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-0.5 ml-1"
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
