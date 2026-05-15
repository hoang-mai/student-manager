"use client";

import React, { useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as XLSX from "xlsx";
import Button from "@/library/Button";
import Typography from "@/library/Typography";
import FileUpload from "@/library/FileUpload";
import { userService } from "@/services/user";
import { useToastStore } from "@/store/useToastStore";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import {
  batchUpdateStudentSchema,
  batchExcelFileSchema,
  BatchExcelFileValues,
  BatchUpdateStudentValues,
} from "@/utils/validations";
import Divide from "@/library/Divide";
import { useModalStore } from "@/store/useModalStore";
import useAppMutation from "@/hooks/useAppMutation";

const UpdateBatchStudents: React.FC = () => {
  const [parsedData, setParsedData] = useState<BatchUpdateStudentValues>([]);
  const [isParsing, setIsParsing] = useState(false);
  const { addToast } = useToastStore();
  const { closeModal } = useModalStore();

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
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        // Mapping Excel headers to API fields
        const mappedData = json
          .map((row) => ({
            code: String(row["Mã học viên"] || row["code"] || "").trim(),
            fullName: String(row["Họ và tên"] || row["fullName"] || "").trim(),
            email: String(row["Email"] || row["email"] || "").trim(),
            phoneNumber: String(
              row["Số điện thoại"] || row["phoneNumber"] || ""
            ).trim(),
            birthday: String(row["Ngày sinh"] || row["birthday"] || "").trim(),
            cccd: String(row["CCCD"] || row["cccd"] || "").trim(),
            gender:
              String(row["Giới tính"] || row["gender"] || "")
                .trim()
                .toLowerCase() === "nam"
                ? "MALE"
                : "FEMALE",
            hometown: String(row["Quê quán"] || row["hometown"] || "").trim(),
            placeOfBirth: String(
              row["Nơi sinh"] || row["placeOfBirth"] || ""
            ).trim(),
            ethnicity: String(row["Dân tộc"] || row["ethnicity"] || "").trim(),
            religion: String(row["Tôn giáo"] || row["religion"] || "").trim(),
            rank: String(row["Cấp bậc"] || row["rank"] || "").trim(),
            unit: String(row["Đơn vị"] || row["unit"] || "").trim(),
            positionGovernment: String(
              row["Chức vụ chính quyền"] || row["positionGovernment"] || ""
            ).trim(),
            positionParty: String(
              row["Chức vụ Đảng"] || row["positionParty"] || ""
            ).trim(),
            currentAddress: String(
              row["Địa chỉ hiện tại"] || row["currentAddress"] || ""
            ).trim(),
            dateOfEnlistment: String(
              row["Ngày nhập ngũ"] || row["dateOfEnlistment"] || ""
            ).trim(),
            enrollment: Number(row["Khóa học"] || row["enrollment"] || 0),
            currentCpa4: Number(row["CPA 4.0"] || row["currentCpa4"] || 0),
            currentCpa10: Number(row["CPA 10.0"] || row["currentCpa10"] || 0),
            graduationDate: String(
              row["Ngày tốt nghiệp"] || row["graduationDate"] || ""
            ).trim(),
            partyMemberCardNumber: String(
              row["Số thẻ Đảng"] || row["partyMemberCardNumber"] || ""
            ).trim(),
            probationaryPartyMember: String(
              row["Đảng viên dự bị"] || row["probationaryPartyMember"] || ""
            ).trim(),
            fullPartyMember: String(
              row["Đảng viên chính thức"] || row["fullPartyMember"] || ""
            ).trim(),
          }))
          .filter((item) => item.code);

        const result = batchUpdateStudentSchema.safeParse(mappedData);

        if (!result.success) {
          const firstError = result.error.issues[0];
          const errorMessage = `Lỗi dữ liệu: ${firstError.message} (${String(firstError.path[0])})`;
          addToast({ message: errorMessage, variant: "error" });
          setParsedData([]);
          resetField("file");
          return;
        }

        setParsedData(result.data);
      } catch {
        addToast({ message: "Lỗi định dạng file Excel!", variant: "error" });
        resetField("file");
        setParsedData([]);
      } finally {
        setIsParsing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const updateMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.UPDATE_BATCH_STUDENTS,
    mutationFn: (data: BatchUpdateStudentValues) =>
      userService.updateBatchStudents(data),
    invalidateQueryKey: [QUERY_KEYS.USERS],
    successMessage: "Cập nhật hàng loạt thành công!",
    errorMessage: "Cập nhật hàng loạt thất bại!",
    onSuccess: () => closeModal(),
  });

  const downloadTemplate = () => {
    const headers = [
      "Mã học viên",
      "Họ và tên",
      "Email",
      "Số điện thoại",
      "Ngày sinh",
      "CCCD",
      "Giới tính",
      "Quê quán",
      "Nơi sinh",
      "Dân tộc",
      "Tôn giáo",
      "Cấp bậc",
      "Đơn vị",
      "Chức vụ chính quyền",
      "Chức vụ Đảng",
      "Địa chỉ hiện tại",
      "Ngày nhập ngũ",
      "Khóa học",
      "CPA 4.0",
      "CPA 10.0",
      "Ngày tốt nghiệp",
      "Số thẻ Đảng",
      "Đảng viên dự bị",
      "Đảng viên chính thức",
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cap nhat hoc vien");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Mau_Cap_Nhat_Hoc_Vien.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const onSubmit = () => {
    if (parsedData.length === 0) {
      addToast({
        message: "Vui lòng chọn file có dữ liệu hợp lệ!",
        variant: "error",
      });
      return;
    }
    updateMutation.mutate(parsedData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-h-[85vh] py-2 gap-4"
    >
      <div className="flex-1 overflow-y-auto px-1 custom-scrollbar space-y-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <HiOutlineDownload size={24} />
          </div>
          <div className="flex-1">
            <Typography variant="body" weight="bold" color="primary">
              Hướng dẫn cập nhật hàng loạt
            </Typography>
            <Typography variant="caption" color="gray" className="block mt-1">
              Sử dụng file mẫu Excel. Cột &#34;Mã học viên&#34; là bắt buộc để
              xác định đối tượng cập nhật.
            </Typography>
            <button
              type="button"
              onClick={downloadTemplate}
              className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
            >
              Tải file mẫu (.xlsx)
            </button>
          </div>
        </div>

        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Chọn file cập nhật"
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
              isLoading={updateMutation.isPending || isParsing}
              required
            />
          )}
        />

        {isParsing && (
          <div className="py-8 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <Typography variant="caption" color="gray">
              Đang phân tích dữ liệu Excel...
            </Typography>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Divide />
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => closeModal()}
            disabled={updateMutation.isPending || isParsing}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={updateMutation.isPending}
            disabled={!isDirty || parsedData.length === 0 || isParsing}
          >
            Cập nhật {parsedData.length} học viên
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateBatchStudents;
