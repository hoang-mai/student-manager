"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineDownload, HiOutlineTable } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx";
import { z } from "zod";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import FileUpload from "@/library/FileUpload";
import Badge, { BadgeVariant } from "@/library/Badge";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { QUERY_KEYS } from "@/constants/query-keys";
import { CreateUserRequest } from "@/types/auth";
import {
  batchUserSchema,
  batchExcelFileSchema,
  BatchExcelFileValues,
} from "@/utils/validations";
import { ROLES } from "@/constants/constants";

interface CreateBatchUsersProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface ExcelRow {
  "Tên đăng nhập"?: string;
  "Họ và tên"?: string;
  Email?: string;
  "Vai trò"?: string;
  "Mật khẩu"?: string;
}

const CreateBatchUsers: React.FC<CreateBatchUsersProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [parsedData, setParsedData] = useState<CreateUserRequest[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { showLoading, hideLoading } = useLoadingStore();

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors, isDirty },
  } = useForm<BatchExcelFileValues>({
    resolver: zodResolver(batchExcelFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleExcelParsing = (file: File | null) => {
    if (!file) {
      setParsedData([]);
      return;
    }

    setIsParsing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        // Mapping Excel headers to API fields
        const mappedData = json
          .map((row) => {
            const rawRole = String(row["Vai trò"] || "").trim().toLowerCase();
            const roleMap: Record<string, "STUDENT" | "COMMANDER" | "ADMIN"> = {
              "chỉ huy": "COMMANDER",
              "quản trị viên": "ADMIN",
              admin: "ADMIN",
              "học viên": "STUDENT",
            };

            return {
              username: String(row["Tên đăng nhập"] || "").trim(),
              fullName: String(row["Họ và tên"] || "").trim(),
              email: String(row.Email || "").trim(),
              role: roleMap[rawRole] || "STUDENT",
            };
          })
          .filter((user) => user.username);

        // Validation data with Zod
        const result = batchUserSchema.safeParse(mappedData);

        if (!result.success) {
          const firstError = result.error.issues[0];
          const errorMessage = `Lỗi dữ liệu: ${firstError.message} (${String(firstError.path[0])})`;
          addToast({ message: errorMessage, variant: "error" });
          setParsedData([]);
          resetField("file");
          return;
        }

        setParsedData(result.data as CreateUserRequest[]);
        if (result.data.length === 0) {
          addToast({ message: "File Excel không có dữ liệu hợp lệ!", variant: "error" });
          resetField("file");
          setParsedData([]);
        }
      } catch (err) {
        addToast({ message: "Lỗi định dạng file Excel!", variant: "error" });
        resetField("file");
        setParsedData([]);
      } finally {
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      addToast({ message: "Không thể đọc file!", variant: "error" });
      resetField("file");
      setParsedData([]);
      setIsParsing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const batchMutation = useMutation({
    mutationFn: (data: CreateUserRequest[]) => {
      showLoading();
      return userService.createBatchUsers(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ message: "Thêm người dùng thành công!", variant: "success" });
      onSuccess();
    },
    onError: (err: Error) => {
      addToast({ message: err.message || "Thêm người dùng thất bại!", variant: "error" });
    },
    onSettled: () => hideLoading(),
  });

  const onSubmit = () => {
    if (parsedData.length === 0) {
      addToast({ message: "Vui lòng chọn file có dữ liệu hợp lệ!", variant: "error" });
      return;
    }
    batchMutation.mutate(parsedData);
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        "Tên đăng nhập": "nguyenvana",
        "Họ và tên": "Nguyễn Văn A",
        Email: "vana@example.com",
        "Vai trò": "Học viên",
      },
      {
        "Tên đăng nhập": "tranvanb",
        "Họ và tên": "Trần Văn B",
        Email: "vanb@example.com",
        "Vai trò": "Chỉ Huy",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sach nguoi dung");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Mau_Tao_Tai_Khoan.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
        <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
          <HiOutlineDownload size={24} />
        </div>
        <div className="flex-1">
          <Typography variant="body" weight="bold" color="primary">Hướng dẫn tạo hàng loạt</Typography>
          <Typography variant="caption" color="gray" className="block mt-1">
            Sử dụng file mẫu Excel. Cột hỗ trợ: Tên đăng nhập, Họ và tên, Email, Vai trò.
          </Typography>
          <button type="button" onClick={downloadTemplate} className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer">
            Tải file mẫu (.xlsx)
          </button>
        </div>
      </div>

      <Controller
        name="file"
        control={control}
        render={({ field }) => (
          <FileUpload
            label="Chọn file danh sách"
            value={field.value}
            onFileSelect={(file) => {
              field.onChange(file);
              handleExcelParsing(file);
            }}
            onRemove={() => {
              setParsedData([]);
            }}
            accept=".xlsx, .xls"
            error={errors.file?.message}
            isLoading={batchMutation.isPending || isParsing}
            required
          />
        )}
      />

      {isParsing && (
        <div className="py-8 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <Typography variant="caption" color="gray">Đang phân tích dữ liệu Excel...</Typography>
        </div>
      )}

      {!isParsing && parsedData.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-primary-600">
            <HiOutlineTable size={20} />
            <Typography variant="body" weight="bold">Xem trước dữ liệu ({parsedData.length} dòng)</Typography>
          </div>
          <div className="max-h-62.5 overflow-auto border border-neutral-100 rounded-xl">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-neutral-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-bold border-b border-neutral-100">Username</th>
                  <th className="px-3 py-2 font-bold border-b border-neutral-100">Họ tên</th>
                  <th className="px-3 py-2 font-bold border-b border-neutral-100">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.slice(0, 10).map((row, idx) => {
                  const variantMap: Record<string, BadgeVariant> = {
                    ADMIN: "primary",
                    COMMANDER: "secondary",
                    STUDENT: "neutral",
                  };
                  return (
                    <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-3 py-2 border-b border-neutral-100 font-medium">{row.username}</td>
                      <td className="px-3 py-2 border-b border-neutral-100">{row.fullName || "-"}</td>
                      <td className="px-3 py-2 border-b border-neutral-100">
                        <Badge variant={variantMap[row.role] || "neutral"}>
                          {ROLES[row.role].name}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
                }
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <div className="p-2 text-center bg-neutral-50/30 text-neutral-400 italic text-xs">Và {parsedData.length - 10} người dùng khác...</div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 mt-6">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={batchMutation.isPending || isParsing}>Hủy bỏ</Button>
        <Button variant="primary" type="submit" isLoading={batchMutation.isPending} disabled={!isDirty || parsedData.length === 0 || isParsing}>
          Tạo {parsedData.length} tài khoản
        </Button>
      </div>
    </form>
  );
};

export default CreateBatchUsers;
