"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  HiOutlineCheck,
  HiOutlineDownload,
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineUpload,
  HiOutlineX,
} from "react-icons/hi";
import ActionButton from "@/library/ActionButton";
import Badge from "@/library/Badge";
import Button from "@/library/Button";
import ErrorState from "@/library/ErrorState";
import Table from "@/library/Table";
import Typography from "@/library/Typography";
import { FilterField } from "@/library/table/TableFilter";
import useAppMutation from "@/hooks/useAppMutation";
import useTableQuery from "@/hooks/useTableQuery";
import { MUTATION_KEYS, QUERY_KEYS } from "@/constants/query-keys";
import { cutRiceService } from "@/services/cut-rice";
import { semesterService } from "@/services/semesters";
import { downloadBlob, formatDateTime } from "@/utils/fn-common";
import {
  CutRice,
  CutRiceQueryRequest,
  CutRiceRequest,
} from "@/types/cut-rice";
import CutRiceSkeleton from "./CutRiceSkeleton";
import EditCutRiceForm from "./EditCutRiceForm";
import ImportCutRiceForm from "./ImportCutRiceForm";
import { useModalStore } from "@/store/useModalStore";

const mealDays = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

const getCutRiceUser = (record: CutRice | CutRiceRequest) => record.User || record.user;
const getCutRiceProfile = (record: CutRice | CutRiceRequest) => {
  const user = getCutRiceUser(record);
  return user?.Profile || user?.profile;
};
const getStudentName = (record: CutRice | CutRiceRequest) =>
  getCutRiceProfile(record)?.fullName ||
  getCutRiceUser(record)?.username ||
  record.userId;
const getSlot = (record: Pick<CutRice, "weekly"> | Pick<CutRiceRequest, "weekly">, day: string) => {
  const weekly = record.weekly || {};
  return weekly[day] || weekly[day.toLowerCase()] || {};
};
const getSemesterText = (record: CutRice | CutRiceRequest) => {
  const semester = record.semesterInfo;
  return semester
    ? `${semester.schoolYearInfo?.schoolYear || ""} - Học kỳ ${semester.code}`.trim()
    : "Chưa gắn học kỳ";
};
const formatWeekRange = (start?: string | null, end?: string | null) =>
  start && end
    ? `${start.split("-").reverse().join("/")} - ${end.split("-").reverse().join("/")}`
    : "Chưa gắn tuần";
const getRequestStatus = (request: CutRiceRequest) => {
  if (request.status === "APPROVED") return { label: "Đã duyệt", variant: "success" as const };
  if (request.status === "REJECTED") return { label: "Từ chối", variant: "error" as const };
  return { label: "Chờ duyệt", variant: "warning" as const };
};

export default function CutRiceTab() {
  const { openModal } = useModalStore();
  const [view, setView] = useState<"schedules" | "requests">("schedules");

  const { data: semestersData, isLoading: isLoadingSemesters } = useQuery({
    queryKey: [QUERY_KEYS.SEMESTERS, "cut-rice-options"],
    queryFn: () => semesterService.getSemesters({ fetchAll: true }),
  });

  const semesterOptions = useMemo(
    () =>
      (semestersData?.data || []).map((semester) => ({
        value: semester.id,
        label: [
          semester.schoolYearInfo?.schoolYear,
          `Học kỳ ${semester.code}`,
        ]
          .filter(Boolean)
          .join(" - "),
      })),
    [semestersData?.data]
  );

  const cutRice = useTableQuery<CutRice>({
    queryKey: [QUERY_KEYS.CUT_RICE],
    fetchData: cutRiceService.getCutRiceList,
  });

  const requests = useTableQuery<CutRiceRequest>({
    queryKey: [QUERY_KEYS.CUT_RICE_REQUESTS],
    fetchData: cutRiceService.getRequests,
  });

  const generateAllMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.GENERATE_ALL_CUT_RICE,
    mutationFn: cutRiceService.generateAll,
    invalidateQueryKey: [QUERY_KEYS.CUT_RICE],
    successMessage: "Tạo lịch cắt cơm tự động thành công!",
    errorMessage: "Tạo lịch cắt cơm thất bại!",
  });

  const generateOneMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.GENERATE_CUT_RICE,
    mutationFn: ({
      userId,
      semesterId,
      weekStartDate,
    }: {
      userId: string;
      semesterId?: string | null;
      weekStartDate?: string | null;
    }) =>
      cutRiceService.generateForStudent(
        userId,
        semesterId || undefined,
        weekStartDate || undefined
      ),
    invalidateQueryKey: [QUERY_KEYS.CUT_RICE],
    successMessage: "Tạo lại lịch cắt cơm thành công!",
    errorMessage: "Tạo lại lịch cắt cơm thất bại!",
  });

  const approveMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.APPROVE_CUT_RICE_REQUEST,
    mutationFn: (id: string) => cutRiceService.approveRequest(id),
    invalidateQueryKey: [QUERY_KEYS.CUT_RICE_REQUESTS],
    successMessage: "Duyệt yêu cầu cắt cơm thành công!",
    errorMessage: "Duyệt yêu cầu thất bại!",
    onSuccess: async () => {
      await cutRice.refetch();
      await requests.refetch();
    },
  });

  const rejectMutation = useAppMutation({
    mutationKey: MUTATION_KEYS.REJECT_CUT_RICE_REQUEST,
    mutationFn: (id: string) => cutRiceService.rejectRequest(id),
    invalidateQueryKey: [QUERY_KEYS.CUT_RICE_REQUESTS],
    successMessage: "Từ chối yêu cầu cắt cơm thành công!",
    errorMessage: "Từ chối yêu cầu thất bại!",
    onSuccess: async () => {
      await requests.refetch();
    },
  });

  const exportMutation = useAppMutation({
    mutationKey: [QUERY_KEYS.CUT_RICE, "export"],
    mutationFn: () => {
      const filterParams = cutRice.columnFilters.reduce(
        (acc, filter) => {
          acc[filter.id] = filter.value;
          return acc;
        },
        {} as Record<string, unknown>
      );

      return cutRiceService.exportExcel({
        ...filterParams,
        sortBy: cutRice.sorting[0]?.id,
        sortOrder: cutRice.sorting[0]?.desc ? "desc" : "asc",
      } as CutRiceQueryRequest);
    },
    successMessage: "Xuất Excel thành công!",
    errorMessage: "Xuất Excel thất bại!",
    onSuccess: (blob) => downloadBlob(blob, "lich-cat-com.xlsx"),
  });

  const handleImport = () => {
    openModal({
      title: "Nhập lịch cắt cơm từ Excel",
      content: <ImportCutRiceForm />,
      size: "md",
      config: { mutationKey: [QUERY_KEYS.CUT_RICE, "import"] },
    });
  };

  const scheduleColumns = useMemo<ColumnDef<CutRice>[]>(
    () => [
      {
        id: "student",
        header: "Học viên",
        meta: { noWrap: true },
        cell: (info) => (
          <div>
            <Typography variant="body" weight="semibold" color="neutral">
              {getStudentName(info.row.original)}
            </Typography>
            <Typography variant="caption" color="gray">
              {getCutRiceProfile(info.row.original)?.code ||
                getCutRiceProfile(info.row.original)?.unit ||
                info.row.original.userId}
            </Typography>
          </div>
        ),
      },
      {
        id: "semester",
        header: "Học kỳ",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {getSemesterText(info.row.original)}
          </Typography>
        ),
      },
      {
        id: "auto",
        header: "Trạng thái",
        cell: (info) => (
          <Badge variant={info.row.original.isAutoGenerated ? "success" : "warning"}>
            {info.row.original.isAutoGenerated ? "Tự động" : "Thủ công"}
          </Badge>
        ),
      },
      {
        id: "week",
        header: "Tuần",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {formatWeekRange(info.row.original.weekStartDate, info.row.original.weekEndDate)}
          </Typography>
        ),
      },
      {
        id: "weekly",
        header: "Lịch cắt",
        cell: (info) => (
          <div className="flex max-w-xl flex-wrap gap-1">
            {mealDays.some((day) => {
              const slot = getSlot(info.row.original, day);
              return slot.morning || slot.noon || slot.evening;
            }) ? mealDays.map((day) => {
              const slot = getSlot(info.row.original, day);
              const count = Number(!!slot.morning) + Number(!!slot.noon) + Number(!!slot.evening);
              return count ? (
                <Badge key={day} variant="secondary">
                  {day}: {count}/3
                </Badge>
              ) : null;
            }) : (
              <Typography variant="caption" color="gray">
                Chưa có lịch cắt
              </Typography>
            )}
          </div>
        ),
      },
      {
        id: "updatedAt",
        header: "Cập nhật",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {formatDateTime(info.row.original.updatedAt)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: (info) => {
          const record = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <ActionButton
                tooltipText="Chỉnh thủ công"
                icon={HiOutlinePencil}
                color="blue"
                onClick={() =>
                  openModal({
                    title: "Chỉnh lịch cắt cơm",
                    content: <EditCutRiceForm record={record} />,
                    size: "xl",
                  })
                }
              />
              <ActionButton
                tooltipText="Tạo lại tự động"
                icon={HiOutlineRefresh}
                color="green"
                onClick={() =>
                  generateOneMutation.mutate({
                    userId: record.userId,
                    semesterId: record.semesterId,
                    weekStartDate: record.weekStartDate,
                  })
                }
              />
            </div>
          );
        },
      },
    ],
    [generateOneMutation, openModal]
  );

  const requestColumns = useMemo<ColumnDef<CutRiceRequest>[]>(
    () => [
      {
        id: "student",
        header: "Học viên",
        cell: (info) => (
          <div>
            <Typography variant="body" weight="semibold" color="neutral">
              {getStudentName(info.row.original)}
            </Typography>
            <Typography variant="caption" color="gray">
              {getCutRiceProfile(info.row.original)?.code || info.row.original.userId}
            </Typography>
          </div>
        ),
      },
      {
        id: "semester",
        header: "Học kỳ",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {getSemesterText(info.row.original)}
          </Typography>
        ),
      },
      {
        id: "weekly",
        header: "Đề xuất",
        cell: (info) => (
          <div className="flex max-w-xl flex-wrap gap-1">
            {mealDays.map((day) => {
              const slot = getSlot(info.row.original, day);
              const count = Number(!!slot.morning) + Number(!!slot.noon) + Number(!!slot.evening);
              return count ? (
                <Badge key={day} variant="secondary">
                  {day}: {count}/3
                </Badge>
              ) : null;
            })}
          </div>
        ),
      },
      {
        id: "week",
        header: "Tuần",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {formatWeekRange(info.row.original.weekStartDate, info.row.original.weekEndDate)}
          </Typography>
        ),
      },
      {
        id: "status",
        header: "Trạng thái",
        cell: (info) => {
          const status = getRequestStatus(info.row.original);
          return <Badge variant={status.variant}>{status.label}</Badge>;
        },
      },
      {
        id: "notes",
        header: "Ghi chú",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {info.row.original.reviewNote || info.row.original.notes || "Không có ghi chú"}
          </Typography>
        ),
      },
      {
        id: "createdAt",
        header: "Ngày gửi",
        cell: (info) => (
          <Typography variant="caption" color="gray">
            {formatDateTime(info.row.original.createdAt)}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: (info) => {
          const record = info.row.original;
          if (record.status !== "PENDING") {
            return (
              <Typography variant="caption" color="gray">
                Đã xử lý
              </Typography>
            );
          }

          return (
            <div className="flex items-center gap-1">
              <ActionButton
                tooltipText="Duyệt yêu cầu"
                icon={HiOutlineCheck}
                color="green"
                onClick={() => approveMutation.mutate(record.id)}
              />
              <ActionButton
                tooltipText="Từ chối yêu cầu"
                icon={HiOutlineX}
                color="red"
                onClick={() => rejectMutation.mutate(record.id)}
              />
            </div>
          );
        },
      },
    ],
    [approveMutation, rejectMutation]
  );

  const commonFilterOptions = useMemo<FilterField[]>(
    () => [
      {
        type: "select",
        id: "semesterId",
        label: "Học kỳ",
        placeholder: "Chọn học kỳ",
        options: semesterOptions,
        isLoading: isLoadingSemesters,
      },
      {
        type: "text",
        id: "fullName",
        label: "Tên học viên",
        placeholder: "Nhập tên học viên...",
      },
      {
        type: "text",
        id: "userId",
        label: "User ID",
        placeholder: "Nhập userId...",
      },
      {
        type: "date",
        id: "weekStartDate",
        label: "Tuần áp dụng",
        placeholder: "Chọn ngày trong tuần",
      },
    ],
    [isLoadingSemesters, semesterOptions]
  );

  const requestFilterOptions = useMemo<FilterField[]>(
    () => [
      ...commonFilterOptions,
      {
        type: "select",
        id: "status",
        label: "Trạng thái",
        placeholder: "Chọn trạng thái",
        options: [
          { value: "PENDING", label: "Chờ duyệt" },
          { value: "APPROVED", label: "Đã duyệt" },
          { value: "REJECTED", label: "Từ chối" },
        ],
      },
    ],
    [commonFilterOptions]
  );

  if (cutRice.isLoading && view === "schedules") return <CutRiceSkeleton />;

  if (cutRice.isError && view === "schedules") {
    return (
      <ErrorState
        title="Không thể tải lịch cắt cơm"
        message={cutRice.error?.message || "Vui lòng thử lại sau ít phút."}
        onRetry={() => cutRice.refetch()}
      />
    );
  }

  if (requests.isError && view === "requests") {
    return (
      <ErrorState
        title="Không thể tải yêu cầu cắt cơm"
        message={requests.error?.message || "Vui lòng thử lại sau ít phút."}
        onRetry={() => requests.refetch()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-2xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setView("schedules")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              view === "schedules"
                ? "bg-primary-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            Lịch cắt cơm
          </button>
          <button
            type="button"
            onClick={() => setView("requests")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              view === "requests"
                ? "bg-primary-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            }`}
          >
            Yêu cầu cắt cơm
          </button>
        </div>

        {view === "schedules" && (
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={handleImport}>
              <HiOutlineUpload /> Nhập Excel
            </Button>
            <Button
              variant="secondary"
              onClick={() => exportMutation.mutate()}
              isLoading={exportMutation.isPending}
            >
              <HiOutlineDownload /> Xuất Excel
            </Button>
            <Button
              variant="primary"
              onClick={() => generateAllMutation.mutate()}
              isLoading={generateAllMutation.isPending}
            >
              <HiOutlineRefresh /> Tạo tự động
            </Button>
          </div>
        )}
      </div>

      {view === "schedules" ? (
        <Table
          data={cutRice.data}
          columns={scheduleColumns}
          pagination={cutRice.pagination}
          onPaginationChange={cutRice.setPagination}
          columnFilters={cutRice.columnFilters}
          onColumnFiltersChange={cutRice.setColumnFilters}
          sorting={cutRice.sorting}
          onSortingChange={cutRice.setSorting}
          filterFields={commonFilterOptions}
          emptyText="Không tìm thấy lịch cắt cơm"
        />
      ) : requests.isLoading ? (
        <CutRiceSkeleton />
      ) : (
        <Table
          data={requests.data}
          columns={requestColumns}
          pagination={requests.pagination}
          onPaginationChange={requests.setPagination}
          columnFilters={requests.columnFilters}
          onColumnFiltersChange={requests.setColumnFilters}
          sorting={requests.sorting}
          onSortingChange={requests.setSorting}
          filterFields={requestFilterOptions}
          emptyText="Không tìm thấy yêu cầu cắt cơm"
        />
      )}
    </div>
  );
}
