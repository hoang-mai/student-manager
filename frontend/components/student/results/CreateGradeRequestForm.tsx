"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import Input from "@/library/Input";
import Select from "@/library/Select";
import Typography from "@/library/Typography";
import Button from "@/library/Button";
import useAppMutation from "@/hooks/useAppMutation";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { studentAcademicService } from "@/services/student-academic";
import { useModalStore } from "@/store/useModalStore";
import {
  CreateGradeRequestRequest,
  GradeRequestType,
  SubjectResult,
} from "@/types/student-academic";

interface CreateGradeRequestFormProps {
  subjects: SubjectResult[];
}

type FormValues = {
  subjectResultId: string;
  requestType: GradeRequestType;
  proposedLetterGrade?: string;
  proposedGradePoint4?: string;
  proposedGradePoint10?: string;
  attachmentUrl?: string;
  reason: string;
};

export default function CreateGradeRequestForm({ subjects }: CreateGradeRequestFormProps) {
  const { closeModal } = useModalStore();

  const subjectOptions = useMemo(
    () =>
      subjects.map((subject) => ({
        value: subject.id,
        label: `${subject.subjectCode || "---"} - ${subject.subjectName || "Môn học"}`,
      })),
    [subjects]
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      subjectResultId: subjects[0]?.id ? String(subjects[0].id) : "",
      requestType: "UPDATE",
      reason: "",
    },
  });

  const selectedSubjectId = useWatch({ control, name: "subjectResultId" });
  const selectedRequestType = useWatch({ control, name: "requestType" });
  const selectedSubject = subjects.find(
    (subject) => String(subject.id) === String(selectedSubjectId)
  );

  const mutation = useAppMutation({
    mutationKey: MUTATION_KEYS.CREATE_STUDENT_GRADE_REQUEST,
    mutationFn: (data: CreateGradeRequestRequest) =>
      studentAcademicService.createGradeRequest(data),
    invalidateQueryKey: [QUERY_KEYS.STUDENT_GRADE_REQUESTS],
    successMessage: "Gửi đề xuất thành công!",
    errorMessage: "Gửi đề xuất thất bại!",
    onSuccess: () => closeModal(),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      subjectResultId: values.subjectResultId,
      requestType: values.requestType,
      proposedLetterGrade: values.proposedLetterGrade || undefined,
      proposedGradePoint4: values.proposedGradePoint4 ? Number(values.proposedGradePoint4) : undefined,
      proposedGradePoint10: values.proposedGradePoint10 ? Number(values.proposedGradePoint10) : undefined,
      attachmentUrl: values.attachmentUrl || undefined,
      reason: values.reason,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-1">
      <div className="rounded-3xl border border-primary-100 bg-primary-50/60 p-4">
        <Typography variant="label" color="primary" className="mb-1">
          Môn học hiện tại
        </Typography>
        <Typography variant="body" weight="bold">
          {selectedSubject?.subjectName || "Chọn môn học cần đề xuất"}
        </Typography>
        {selectedSubject && (
          <Typography variant="body" color="gray" className="mt-1">
            Điểm hiện tại: {selectedSubject.letterGrade || "---"} · {selectedSubject.gradePoint10 ?? "---"}/10 · {selectedSubject.gradePoint4 ?? "---"}/4
          </Typography>
        )}
      </div>

      <Select
        label="Môn học"
        placeholder="Chọn môn học cần chỉnh sửa"
        value={selectedSubjectId}
        onChange={(value) => setValue("subjectResultId", String(value), { shouldValidate: true })}
        options={subjectOptions}
        error={errors.subjectResultId?.message}
        emptyText="Không có môn học"
        required
      />

      <Select
        label="Loại đề xuất"
        value={selectedRequestType}
        onChange={(value) => setValue("requestType", value as GradeRequestType)}
        options={[
          { value: "UPDATE", label: "Điều chỉnh điểm" },
          { value: "ADD", label: "Bổ sung kết quả" },
          { value: "DELETE", label: "Xóa kết quả sai" },
        ]}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Điểm chữ đề xuất" placeholder="VD: A, B+" {...register("proposedLetterGrade")} />
        <Input label="Điểm hệ 4" type="number" placeholder="VD: 3.6" {...register("proposedGradePoint4")} />
        <Input label="Điểm hệ 10" type="number" placeholder="VD: 8.7" {...register("proposedGradePoint10")} />
      </div>

      <Input label="Minh chứng (URL)" placeholder="Dán liên kết minh chứng nếu có" {...register("attachmentUrl")} />

      <div className="space-y-2">
        <label className="text-sm font-bold text-neutral-700">Lý do đề xuất <span className="text-red-500">*</span></label>
        <textarea
          {...register("reason", { required: "Vui lòng nhập lý do đề xuất" })}
          rows={4}
          placeholder="Trình bày rõ lý do và căn cứ đề xuất chỉnh sửa kết quả..."
          className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
        />
        {errors.reason?.message && <p className="text-xs font-medium text-red-500">{errors.reason.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={closeModal}>Hủy</Button>
        <Button type="submit" variant="primary" disabled={mutation.isPending || subjects.length === 0}>
          Gửi đề xuất
        </Button>
      </div>
    </form>
  );
}
