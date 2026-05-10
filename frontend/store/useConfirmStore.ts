import { create } from "zustand";

/**
 * Các loại màu sắc hỗ trợ cho nút xác nhận
 */
export type ConfirmVariant = "primary" | "danger" | "warning";

/**
 * Trạng thái của Confirm Store
 */
interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmVariant;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel?: () => void;

  /** Hiển thị hộp thoại xác nhận */
  openConfirm: (params: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: ConfirmVariant;
    isLoading?: boolean;
  }) => void;
  
  /** Đóng hộp thoại */
  closeConfirm: () => void;
  setLoading: (isLoading: boolean) => void;
}

/**
 * Store quản lý trạng thái Xác nhận (Confirm) toàn cục
 */
export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  title: "",
  message: "",
  confirmText: "Xác nhận",
  cancelText: "Hủy",
  variant: "primary",
  isLoading: false,
  onConfirm: () => {},
  onCancel: undefined,

  openConfirm: ({
    title,
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    variant = "primary",
    isLoading = false,
    onConfirm,
    onCancel,
  }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      variant,
      isLoading,
      onConfirm,
      onCancel,
    }),

  closeConfirm: () => {
    const { onCancel } = get();
    if (onCancel) onCancel();
    set({ isOpen: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
