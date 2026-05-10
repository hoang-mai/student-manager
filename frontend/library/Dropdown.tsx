"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DropdownProps {
  /** Thành phần kích hoạt menu (nút bấm, avatar, v.v.). Có thể là ReactNode hoặc một function nhận vào trạng thái isOpen */
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
  /** Nội dung bên trong menu xổ xuống */
  children: React.ReactNode;
  /** Hướng căn lề của menu so với trigger */
  align?: "left" | "right";
  /** Class CSS cho container bên ngoài */
  className?: string;
  /** Class CSS cho container của menu xổ xuống */
  dropdownClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "right",
  className = "",
  dropdownClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {typeof trigger === "function" ? trigger(isOpen) : trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-3 z-[100] ${dropdownClassName}`}
          >
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
