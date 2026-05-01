"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Theme khởi tạo từ server (đọc từ cookie) */
  initialTheme?: string;
}

/**
 * ThemeProvider — Sử dụng next-themes để quản lý dark mode.
 * Tự động xử lý hydration mismatch và gắn class "dark" lên thẻ <html>.
 */
export default function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={initialTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
