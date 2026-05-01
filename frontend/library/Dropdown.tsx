"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { motion, AnimatePresence } from "motion/react";

export interface DropdownProps {
  /** Thành phần kích hoạt menu (nút bấm, avatar, v.v.). Có thể là ReactNode hoặc một function nhận vào trạng thái isOpen và placement */
  trigger:
    | React.ReactNode
    | ((isOpen: boolean, placement: "top" | "bottom") => React.ReactNode);
  /** Nội dung bên trong menu xổ xuống */
  children: React.ReactNode;
  /** Hướng căn lề của menu so với trigger */
  align?: "left" | "right";
  /** Class CSS cho container bên ngoài */
  className?: string;
  /** Class CSS cho container của menu xổ xuống */
  dropdownClassName?: string | ((placement: "top" | "bottom") => string);
  /** Chiều cao dự kiến của menu để tính toán hướng (mặc định: 300) */
  menuHeight?: number;
  /** Độ lệch y khi bắt đầu hiệu ứng (mặc định: 10) */
  offsetY?: number;
  /** Độ lệch y khi kết thúc hiệu ứng (mặc định: 10) */
  targetY?: number;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "right",
  className = "",
  dropdownClassName = "",
  menuHeight = 300,
  offsetY = 10,
  targetY = 10,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const calculatePlacement = useCallback(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }
  }, [menuHeight]);

  useLayoutEffect(() => {
    if (isOpen) {
      calculatePlacement();
    }
  }, [isOpen, calculatePlacement]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("scroll", calculatePlacement, true);
      window.addEventListener("resize", calculatePlacement);
    }
    return () => {
      window.removeEventListener("scroll", calculatePlacement, true);
      window.removeEventListener("resize", calculatePlacement);
    };
  }, [isOpen, calculatePlacement]);

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
        {typeof trigger === "function" ? trigger(isOpen, placement) : trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: placement === "bottom" ? offsetY : -offsetY,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: placement === "bottom" ? targetY : -targetY,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: placement === "bottom" ? offsetY : -offsetY,
              scale: 0.95,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`
              absolute 
              ${align === "right" ? "right-0" : "left-0"} 
              ${placement === "bottom" ? "top-full" : "bottom-full"} 
              z-20 
              ${typeof dropdownClassName === "function" ? dropdownClassName(placement) : dropdownClassName}
            `}
          >
            <div onClick={() => setIsOpen(false)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
