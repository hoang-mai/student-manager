"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement,
  size,
} from "@floating-ui/react";

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
  /** Độ lệch y khi bắt đầu hiệu ứng (mặc định: 10) */
  offsetY?: number;
  /** Độ lệch y khi kết thúc hiệu ứng (mặc định: 10) */
  targetY?: number;
  /** Bắt buộc dropdown phải có chiều rộng bằng đúng với phần tử trigger */
  fullwidth?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "right",
  className = "",
  dropdownClassName = "",
  offsetY = 10,
  targetY = 10,
  fullwidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Map "left" / "right" tới Floating UI placement
  const getInitialPlacement = (): Placement => {
    if (align === "left") return "bottom-start";
    if (align === "right") return "bottom-end";
    return "bottom";
  };

  // Lấy thẳng x, y, strategy thay vì floatingStyles để tránh xung đột transform với framer-motion
  const { refs, x, y, strategy, context, placement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: getInitialPlacement(),
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(targetY), 
      flip({ padding: 16 }), 
      shift({ padding: 16 }), 
      ...(fullwidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
  });

  // Tương tác (Interactions)
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  // Trích xuất "top" hoặc "bottom" từ "bottom-start" / "top-end"
  const basePlacement = placement.split("-")[0] as "top" | "bottom";

  return (
    <div className={`relative ${className}`}>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="cursor-pointer"
      >
        {typeof trigger === "function" ? trigger(isOpen, basePlacement) : trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              ref={refs.setFloating}
              style={{ 
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 9999 
              }}
              {...getFloatingProps()}
              initial={{
                opacity: 0,
                y: basePlacement === "top" ? targetY - offsetY : offsetY - targetY,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: basePlacement === "top" ? targetY - offsetY : offsetY - targetY,
                scale: 0.95,
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`
                ${typeof dropdownClassName === "function" ? dropdownClassName(basePlacement) : dropdownClassName}
              `}
            >
              <div onClick={() => setIsOpen(false)}>{children}</div>
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
