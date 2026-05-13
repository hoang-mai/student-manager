"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useConfirmStore } from "@/store/useConfirmStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useToastStore, type ToastVariant } from "@/store/useToastStore";

type AppMutationOptions<
  TData,
  TVariables,
  TError extends { message?: string },
  TOnMutateResult
> = Omit<
  UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
  "mutationFn" | "onSuccess" | "onError" | "onSettled"
> & {
  mutationFn: NonNullable<
    UseMutationOptions<
      TData,
      TError,
      TVariables,
      TOnMutateResult
    >["mutationFn"]
  >;
  invalidateQueryKey?: QueryKey;
  successMessage?: string;
  errorMessage?: string;
  successVariant?: ToastVariant;
  errorVariant?: ToastVariant;
  enableGlobalLoading?: boolean;
  enableConfirmLoading?: boolean;
  closeConfirmOnSuccess?: boolean;
  onSuccess?: UseMutationOptions<
    TData,
    TError,
    TVariables,
    TOnMutateResult
  >["onSuccess"];
  onError?: UseMutationOptions<
    TData,
    TError,
    TVariables,
    TOnMutateResult
  >["onError"];
  onSettled?: UseMutationOptions<
    TData,
    TError,
    TVariables,
    TOnMutateResult
  >["onSettled"];
};

export default function useAppMutation<
  TData = unknown,
  TVariables = void,
  TError extends { message?: string } = Error,
  TOnMutateResult = unknown
>({
  mutationFn,
  invalidateQueryKey,
  successMessage = "Thao tác thành công!",
  errorMessage = "Thao tác thất bại!",
  successVariant = "success",
  errorVariant = "error",
  enableGlobalLoading = true,
  enableConfirmLoading = false,
  closeConfirmOnSuccess = false,
  onSuccess,
  onError,
  onSettled,
  ...options
}: AppMutationOptions<TData, TVariables, TError, TOnMutateResult>) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { closeConfirm, setLoading } = useConfirmStore();
  const { showLoading, hideLoading } = useLoadingStore();

  return useMutation<TData, TError, TVariables, TOnMutateResult>({
    ...options,
    mutationFn: async (variables, context) => {
      if (enableConfirmLoading) {
        setLoading(true);
      }

      if (enableGlobalLoading) {
        showLoading();
      }

      return mutationFn(variables, context);
    },
    onSuccess: async (data, variables, onMutateResult, context) => {
      if (invalidateQueryKey) {
        await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }

      if (successMessage) {
        addToast({
          message: successMessage,
          variant: successVariant,
        });
      }

      if (closeConfirmOnSuccess) {
        closeConfirm();
      }

      await onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: async (err, variables, onMutateResult, context) => {
      addToast({
        message: err.message || errorMessage,
        variant: errorVariant,
      });

      await onError?.(err, variables, onMutateResult, context);
    },
    onSettled: async (data, error, variables, onMutateResult, context) => {
      if (enableConfirmLoading) {
        setLoading(false);
      }

      if (enableGlobalLoading) {
        hideLoading();
      }

      await onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
}
