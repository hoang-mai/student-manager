"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

type MotionProviderProps = {
  children: ReactNode;
};

/**
 * Sử dụng để làm giảm animation của motion khi user bật tính năng hạn chế animation.
 */
export default function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
