"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { QUERY_KEYS } from "@/constants/query-keys";
import useTableQuery from "@/hooks/useTableQuery";
import Badge from "@/library/Badge";
import ErrorState from "@/library/ErrorState";
import Table from "@/library/Table";
import { useModalStore } from "@/store/useModalStore";
import { studentAcademicService } from "@/services/student-academic";
import {
  AcademicResultQueryRequest,
  GradeRequest,
  GradeRequestQueryRequest,
  GradeRequestStatus,
  SemesterResult,
  SubjectResult,
  YearlyResult,
} from "@/types/student-academic";
import CreateGradeRequestForm from "./CreateGradeRequestForm";
import GradeRequestsSkeleton from "./GradeRequestsSkeleton";

const statusMap: Record<GradeRequestStatus, { label: string; variant: "warning" | "success" | "error" }> = {
  PENDING: { label: "Chờ duyệt", variant: "warning" },
  APPROVED: { label: "Đã duyệt", variant: "success" },
  REJECTED: { label: "Từ chối", variant: "error" },
};

const formatScore = (value?: number | null) =>
  value === null || value === undefined ? "---" : value.toFixed(2);

const getRequestSubject = (request: GradeRequest) => request.SubjectResult || request.subjectResult;
const getRequestSemester = (request: GradeRequest) => {
  const subject = getRequestSubject(request);
  return subject?.SemesterResult || subject?.semesterResult;
};
const getSemesters = (year: YearlyResult): SemesterResult[] => year.semesterResults || [];
const getSubjects = (semester: SemesterResult): SubjectResult[] => semester.subjectResults || [];

export default function GradeRequestsTab() {
  const { openModal } = useModalStore();

  const requestsQuery = useTableQuery<GradeRequest, GradeRequestQueryRequest>({
    queryKey: [QUERY_KEYS.STUDENT_GRADE_REQUESTS],
    fetchData: studentAcademicService.getGradeRequests,
  });

  const resultsQuery = useTableQuery<YearlyResult, AcademicResultQueryRequest>({
    queryKey: [QUERY_KEYS.STUDENT_RESULTS, "request-subjects"],
    fetchData: studentAcademicService.getAcademicResults,
  });

  const subjectOptions = useMemo(() => {
    return (resultsQuery.data?.data || [])
      .flatMap((year) => getSemesters(year).flatMap(getSubjects))
      .map((subject) => ({
        id: subject.id,
        semesterResultId: subject.semesterResultId,
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        credits: subject.credits,
        letterGrade: subject.letterGrade,
        gradePoint4: subject.gradePoint4,
        gradePoint10: subject.gradePoint10,
        note: subject.note,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
      }));
  }, [resultsQuery.data]);

  const openCreateRequest = () => {
    openModal({
      title: "Gửi đề xuất chỉnh sửa điểm",
      content: <CreateGradeRequestForm subjects={subjectOptions} />,
      size: "lg",
    });
  };

  const columns = useMemo<ColumnDef<GradeRequest>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Ngày gửi",
        cell: ({ row }) =>
          row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString("vi-VN")
            : "---",
      },
      {
        id: "subject",
        header: "Môn học",
        cell: ({ row }) => getRequestSubject(row.original)?.subjectName || "---",
      },
      {
        id: "semester",
        header: "Học kỳ",
        cell: ({ row }) => getRequestSemester(row.original)?.semester || "---",
      },
      {
        accessorKey: "requestType",
        header: "Loại",
        cell: ({ row }) =>
          row.original.requestType === "UPDATE"
            ? "Điều chỉnh"
            : row.original.requestType === "ADD"
              ? "Bổ sung"
              : "Xóa",
      },
      {
        accessorKey: "proposedLetterGrade",
        header: "Điểm đề xuất",
        cell: ({ row }) => row.original.proposedLetterGrade || formatScore(row.original.proposedGradePoint10),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge variant={statusMap[row.original.status].variant}>
            {statusMap[row.original.status].label}
          </Badge>
        ),
      },
      { accessorKey: "reason", header: "Lý do" },
      {
        accessorKey: "reviewNote",
        header: "Phản hồi",
        cell: ({ row }) => row.original.reviewNote || "Chưa có",
      },
    ],
    []
  );

  if (requestsQuery.isLoading || resultsQuery.isLoading) {
    return <GradeRequestsSkeleton />;
  }

  if (requestsQuery.isError || resultsQuery.isError) {
    return (
      <ErrorState
        onRetry={() => {
          requestsQuery.refetch();
          resultsQuery.refetch();
        }}
      />
    );
  }

  return (
    <Table
      data={requestsQuery.data}
      columns={columns}
      pagination={requestsQuery.pagination}
      onPaginationChange={requestsQuery.setPagination}
      columnFilters={requestsQuery.columnFilters}
      onColumnFiltersChange={requestsQuery.setColumnFilters}
      sorting={requestsQuery.sorting}
      onSortingChange={requestsQuery.setSorting}
      filterFields={[
        {
          id: "status",
          label: "Trạng thái",
          type: "select",
          options: Object.entries(statusMap).map(([value, item]) => ({
            value,
            label: item.label,
          })),
        },
      ]}
      onAdd={openCreateRequest}
      addLabel="Gửi đề xuất"
      emptyText="Chưa có đề xuất chỉnh sửa điểm"
    />
  );
}
