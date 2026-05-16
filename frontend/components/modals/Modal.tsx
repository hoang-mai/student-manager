"use client";

import React, { useEffect, useRef } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { HiOutlineX } from "react-icons/hi";
import Divide from "@/library/Divide";
import { MUTATION_KEYS } from "@/constants/query-keys";
import { useModalStore } from "@/store/useModalStore";

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-[95vw] h-[90vh]",
};

export default function Modal() {
  const { isOpen, title, content, footer, size, config, closeModal } =
    useModalStore();
  const isMutating =
    useIsMutating({
      mutationKey: config?.mutationKey ?? MUTATION_KEYS.MODAL_IDLE,
    }) > 0;
  const modalRef = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    if (isMutating) return;
    closeModal();
  };

  // Xử lý phím ESC và ngăn scroll body
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isMutating) closeModal();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [closeModal, isMutating, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          {/* Lớp nền Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={
              config?.closeOnOverlayClick !== false && !isMutating
                ? handleClose
                : undefined
            }
            className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-xs ${config?.overlayClassName || ""}`}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.8,
            }}
            className={`
              relative w-full bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col
              max-h-[calc(100vh-2rem)]
              ${sizeClasses[size || "md"]}
              ${config?.className || ""}
            `}
          >
            {/* Header */}
            {title && (
              <div className="px-10 pt-8 pb-2 flex flex-col gap-1 items-center justify-between relative shrink-0">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-xl font-black text-neutral-800 uppercase tracking-tighter">
                    {title}
                  </h3>
                  {config?.showCloseButton !== false && (
                    <button
                      onClick={handleClose}
                      disabled={isMutating}
                      className={`size-10 flex items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 transition-all border border-neutral-100 group ${isMutating
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:text-primary-600 hover:bg-primary-50"
                        }`}
                    >
                      <HiOutlineX
                        size={20}
                        className="group-hover:rotate-90 transition-transform duration-300"
                      />
                    </button>
                  )}
                </div>
                <Divide />
              </div>
            )}

            {!title && config?.showCloseButton !== false && (
              <button
                onClick={handleClose}
                disabled={isMutating}
                className={`absolute top-6 right-6 z-10 size-10 flex items-center justify-center rounded-2xl bg-neutral-50/50 backdrop-blur-md text-neutral-400 transition-all border border-neutral-100/50 group ${isMutating
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:text-primary-600 hover:bg-primary-50"
                  }`}
              >
                <HiOutlineX
                  size={20}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            )}

            {/* Content Body */}
            <div className="flex-1 px-10 custom-scrollbar scroll-smooth">
              <div className="text-neutral-600 font-medium leading-relaxed">
                {content}
              </div>
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-10 py-6 relative shrink-0">
                <Divide className="absolute top-0 left-10 right-10" />
                <div className="flex justify-end items-center gap-4">
                  {footer}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
