"use client";

import { motion, AnimatePresence } from "motion/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Button from "@/library/Button";
import { useConfirmStore } from "@/store/useConfirmStore";

/**
 * Component Confirm (Global Renderer)
 * Đọc trạng thái từ useConfirmStore để hiển thị hộp thoại xác nhận toàn hệ thống
 */
const Confirm = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    variant,
    isLoading,
    onConfirm,
    closeConfirm,
  } = useConfirmStore();
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : closeConfirm}
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-4 py-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${variant === "danger"
                      ? "bg-red-50 border-red-100 text-red-500"
                      : variant === "warning"
                        ? "bg-amber-50 border-amber-100 text-amber-500"
                        : "bg-primary-50 border-primary-100 text-primary-600"
                    }`}
                >
                  <HiOutlineExclamationCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-neutral-800 uppercase tracking-tighter">
                    {title}
                  </h3>
                  <p className="text-sm font-medium text-neutral-500 leading-relaxed px-4">
                    {message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-8 px-8">
                <Button
                  variant="ghost"
                  onClick={closeConfirm}
                  isLoading={isLoading}
                  className="flex-1 h-10 rounded-2xl text-[11px] font-black uppercase tracking-wider"
                >
                  {cancelText}
                </Button>
                <Button
                  variant={variant === "danger" ? "danger" : "primary"}
                  onClick={handleConfirm}
                  isLoading={isLoading}
                  className="flex-1 h-10 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary-600/10"
                >
                  {confirmText}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confirm;
