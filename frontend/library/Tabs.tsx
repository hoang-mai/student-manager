"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Typography from "./Typography";

export interface TabItem {
  /** ID duy nhất của tab */
  id: string;
  /** Nhãn hiển thị trên thanh điều hướng tab */
  label: string;
  /** Icon hiển thị cạnh nhãn (tùy chọn) */
  icon?: React.ReactNode;
  /** Nội dung hiển thị khi tab được chọn */
  content: React.ReactNode;
}

interface TabsProps {
  /** Danh sách các tab */
  tabs: TabItem[];
  /** ID của tab đang hoạt động */
  activeTab: string;
  /** Hàm callback khi thay đổi tab */
  onChange: (id: string) => void;
  /** Kiểu hiển thị: pills (dạng nút bo tròn) hoặc underline (dạng gạch chân) */
  variant?: "pills" | "underline";
  /** Có chiếm toàn bộ chiều ngang không */
  fullWidth?: boolean;
  /** Class CSS tùy chỉnh */
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  fullWidth = false,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div
        className={`
          flex p-1 gap-1
          ${variant === "pills" ? "bg-neutral-100 rounded-2xl" : "border-b border-neutral-200"}
          ${fullWidth ? "w-full" : "w-fit"}
        `}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold transition-all duration-300
                ${fullWidth ? "flex-1" : ""}
                ${
                  isActive
                    ? variant === "pills"
                      ? "text-primary-700"
                      : "text-primary-600"
                    : "text-neutral-500 hover:text-neutral-700"
                }
              `}
            >
              {isActive && variant === "pills" && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-neutral-200/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-2">
                {tab.icon && <span>{tab.icon}</span>}
                <Typography variant="body" weight="bold" color="inherit">
                  {tab.label}
                </Typography>
              </div>

              {isActive && variant === "underline" && (
                <motion.div
                  layoutId="active-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden min-h-[100px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {tabs.find((t) => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs;
