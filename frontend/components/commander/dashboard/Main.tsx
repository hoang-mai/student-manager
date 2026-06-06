"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineExternalLink,
  HiOutlineIdentification,
  HiOutlineOfficeBuilding,
  HiOutlineViewGrid,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import Badge from "@/library/Badge";
import PageContainer from "@/library/PageContainer";
import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { achievementService } from "@/services/achievements";
import { classService } from "@/services/classes";
import { gradeRequestService } from "@/services/grade-requests";
import { tuitionFeeService } from "@/services/tuition-fees";
import { userService } from "@/services/user";
import { GradeRequest, statusMap } from "@/types/student-academic";
import { TuitionFee } from "@/types/tuition-fees";
import { Student } from "@/types/user";
import { formatDate, formatDateTime, formatSemesterYear } from "@/utils/fn-common";

type Tone = "primary" | "success" | "warning" | "error" | "sky" | "neutral";

const toneStyles: Record<Tone, string> = {
  primary:
    "border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-700/60 dark:bg-primary-950/40 dark:text-primary-100",
  success:
    "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning:
    "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100",
  error:
    "border-error-100 bg-error-50 text-error-700 dark:border-error-700/60 dark:bg-error-950/40 dark:text-error-100",
  sky: "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-700/60 dark:bg-sky-950/40 dark:text-sky-100",
  neutral:
    "border-neutral-100 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
};

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("vi-VN");

const getTotal = <T,>(response?: PaginatedResponse<T>) =>
  response?.pagination?.total ?? response?.data?.length ?? 0;

export default function Main() {
  const studentsQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_PROFILES, "dashboard-total"],
    queryFn: () => userService.getStudentProfiles({ page: 1, limit: 1 }),
  });

  const recentStudentsQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_PROFILES, "dashboard-recent"],
    queryFn: () =>
      userService.getStudentProfiles({
        page: 1,
        limit: 5,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });

  const classesQuery = useQuery({
    queryKey: [QUERY_KEYS.CLASSES, "dashboard-total"],
    queryFn: () => classService.getClasses({ page: 1, limit: 1 }),
  });

  const pendingRequestsQuery = useQuery({
    queryKey: [QUERY_KEYS.COMMANDER_GRADE_REQUESTS, "dashboard-pending"],
    queryFn: () =>
      gradeRequestService.getCommanderGradeRequests({
        page: 1,
        limit: 5,
        status: "PENDING",
      }),
  });

  const unpaidTuitionQuery = useQuery({
    queryKey: [QUERY_KEYS.TUITION_FEES, "dashboard-unpaid"],
    queryFn: () =>
      tuitionFeeService.getTuitionFees({
        page: 1,
        limit: 5,
        status: "UNPAID",
      }),
  });

  const achievementsQuery = useQuery({
    queryKey: [QUERY_KEYS.ACHIEVEMENTS, "dashboard-total"],
    queryFn: () => achievementService.getAchievements({ page: 1, limit: 1 }),
  });

  const pendingRequests = pendingRequestsQuery.data?.data || [];
  const unpaidTuition = unpaidTuitionQuery.data?.data || [];
  const recentStudents = recentStudentsQuery.data?.data || [];

  const isLoading =
    studentsQuery.isLoading ||
    classesQuery.isLoading ||
    pendingRequestsQuery.isLoading ||
    unpaidTuitionQuery.isLoading ||
    achievementsQuery.isLoading ||
    recentStudentsQuery.isLoading;

  const hasError =
    studentsQuery.isError ||
    classesQuery.isError ||
    pendingRequestsQuery.isError ||
    unpaidTuitionQuery.isError ||
    achievementsQuery.isError ||
    recentStudentsQuery.isError;

  const refetchAll = () => {
    studentsQuery.refetch();
    classesQuery.refetch();
    pendingRequestsQuery.refetch();
    unpaidTuitionQuery.refetch();
    achievementsQuery.refetch();
    recentStudentsQuery.refetch();
  };

  const stats = [
    {
      label: "Học viên",
      value: formatNumber(getTotal(studentsQuery.data)),
      helper: "Hồ sơ đang quản lý",
      href: "/commander/profiles",
      icon: HiOutlineIdentification,
      tone: "primary",
    },
    {
      label: "Lớp học",
      value: formatNumber(getTotal(classesQuery.data)),
      helper: "Lớp trong hệ thống",
      href: "/commander/classes",
      icon: HiOutlineViewGrid,
      tone: "sky",
    },
    {
      label: "Chờ phê duyệt",
      value: formatNumber(getTotal(pendingRequestsQuery.data)),
      helper: "Đề xuất kết quả học tập",
      href: "/commander/approvals",
      icon: HiOutlineCheckCircle,
      tone: "warning",
    },
    {
      label: "Chưa nộp học phí",
      value: formatNumber(getTotal(unpaidTuitionQuery.data)),
      helper: "Bản ghi cần theo dõi",
      href: "/commander/tuition",
      icon: HiOutlineCash,
      tone: "error",
    },
    {
      label: "Thành tích",
      value: formatNumber(getTotal(achievementsQuery.data)),
      helper: "Khen thưởng đã ghi nhận",
      href: "/commander/achievements",
      icon: HiOutlineBadgeCheck,
      tone: "success",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    helper: string;
    href: string;
    icon: IconType;
    tone: Tone;
  }>;

  return (
    <PageContainer
      breadcrumb={[{ label: "Tổng quan" }]}
      title="Tổng quan hệ thống"
      subtitle="Tóm tắt nhanh tình hình học viên, đề xuất, học phí và dữ liệu quản lý trong ngày."
      isLoading={isLoading}
      skeleton={<DashboardSkeleton />}
      isError={hasError}
      onRetry={refetchAll}
      className="space-y-8"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {stats.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <Panel
            title="Đề xuất cần xử lý"
            href="/commander/approvals"
            actionLabel="Xem tất cả"
          >
            <div className="space-y-3">
              {pendingRequests.length ? (
                pendingRequests.map((request) => (
                  <PendingRequestItem key={request.id} request={request} />
                ))
              ) : (
                <EmptyLine
                  icon={HiOutlineCheckCircle}
                  title="Không có đề xuất chờ duyệt"
                  description="Các đề xuất mới của học viên sẽ xuất hiện tại đây."
                />
              )}
            </div>
          </Panel>

          <Panel title="Tác vụ nhanh">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <QuickAction
                href="/commander/profiles"
                icon={HiOutlineIdentification}
                label="Hồ sơ học viên"
                description="Tra cứu và cập nhật hồ sơ"
              />
              <QuickAction
                href="/commander/achievements"
                icon={HiOutlineBadgeCheck}
                label="Quản lý thành tích"
                description="Ghi nhận khen thưởng"
              />
              <QuickAction
                href="/commander/schedules"
                icon={HiOutlineClipboardList}
                label="Lịch học & cắt cơm"
                description="Theo dõi lịch trong tuần"
              />
              <QuickAction
                href="/commander/universities"
                icon={HiOutlineOfficeBuilding}
                label="Cơ sở đào tạo"
                description="Trường, ngành và trình độ"
              />
            </div>
          </Panel>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Panel
            title="Học phí chưa thanh toán"
            href="/commander/tuition"
            actionLabel="Quản lý học phí"
          >
            <div className="space-y-3">
              {unpaidTuition.length ? (
                unpaidTuition.map((item) => (
                  <TuitionItem key={item.id} tuition={item} />
                ))
              ) : (
                <EmptyLine
                  icon={HiOutlineCash}
                  title="Chưa có cảnh báo học phí"
                  description="Các khoản chưa thanh toán sẽ được tổng hợp tại đây."
                />
              )}
            </div>
          </Panel>

          <Panel
            title="Hồ sơ cập nhật gần đây"
            href="/commander/profiles"
            actionLabel="Xem hồ sơ"
          >
            <div className="space-y-3">
              {recentStudents.length ? (
                recentStudents.map((student) => (
                  <StudentItem key={student.id} student={student} />
                ))
              ) : (
                <EmptyLine
                  icon={HiOutlineAcademicCap}
                  title="Chưa có hồ sơ học viên"
                  description="Khi có hồ sơ mới hoặc thay đổi, danh sách sẽ hiển thị tại đây."
                />
              )}
            </div>
          </Panel>
        </section>
      </div>
    </PageContainer>
  );
}

const StatCard = ({
  label,
  value,
  helper,
  href,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  href: string;
  icon: IconType;
  tone: Tone;
}) => (
  <Link
    href={href}
    className={`group block rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none ${toneStyles[tone]}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <Typography variant="label" weight="bold" className="opacity-80">
          {label}
        </Typography>
        <div className="mt-3 text-3xl font-black leading-none">{value}</div>
      </div>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/70 text-current shadow-sm dark:bg-neutral-950/40">
        <Icon size={20} />
      </div>
    </div>
    <Typography variant="caption" className="mt-3 block opacity-75">
      {helper}
    </Typography>
  </Link>
);

const Panel = ({
  title,
  href,
  actionLabel,
  children,
}: {
  title: string;
  href?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
    <div className="mb-4 flex items-center justify-between gap-4">
      <Typography variant="h3" weight="bold">
        {title}
      </Typography>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-primary-700 dark:hover:text-primary-300"
        >
          {actionLabel || "Xem thêm"}
          <HiOutlineExternalLink size={16} />
        </Link>
      )}
    </div>
    {children}
  </section>
);

const PendingRequestItem = ({ request }: { request: GradeRequest }) => (
  <Link
    href="/commander/approvals"
    className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-primary-800 dark:hover:bg-primary-950/20"
  >
    <div className="min-w-0">
      <Typography variant="body" weight="semibold" className="break-words">
        {request.user?.profile?.fullName || "Chưa có tên học viên"}
      </Typography>
      <Typography variant="caption" color="gray" className="mt-1 block">
        {request.subjectResult?.subjectName || "Kết quả học tập"} ·{" "}
        {formatDate(request.createdAt)}
      </Typography>
    </div>
    <Badge variant={statusMap[request.status].variant}>
      {statusMap[request.status].label}
    </Badge>
  </Link>
);

const TuitionItem = ({ tuition }: { tuition: TuitionFee }) => (
  <Link
    href="/commander/tuition"
    className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 transition-colors hover:border-error-200 hover:bg-error-50/40 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-error-900 dark:hover:bg-error-950/20"
  >
    <div className="min-w-0">
      <Typography variant="body" weight="semibold" className="break-words">
        {tuition.user?.profile?.fullName || "Chưa có tên học viên"}
      </Typography>
      <Typography variant="caption" color="gray" className="mt-1 block">
        {formatSemesterYear(tuition.semester, tuition.schoolYear)}
      </Typography>
    </div>
    <Badge variant="warning">Chưa nộp</Badge>
  </Link>
);

const StudentItem = ({ student }: { student: Student }) => (
  <Link
    href="/commander/profiles"
    className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 transition-colors hover:border-sky-200 hover:bg-sky-50/40 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-sky-900 dark:hover:bg-sky-950/20"
  >
    <div className="min-w-0">
      <Typography variant="body" weight="semibold" className="break-words">
        {student.fullName || "Chưa cập nhật"}
      </Typography>
      <Typography variant="caption" color="gray" className="mt-1 block">
        {student.code || "Chưa có mã"} ·{" "}
        {student.class?.className || student.unit || "Chưa phân lớp"}
      </Typography>
    </div>
    <Typography variant="caption" color="gray" className="whitespace-nowrap">
      {formatDateTime(student.updatedAt)}
    </Typography>
  </Link>
);

const QuickAction = ({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: IconType;
  label: string;
  description: string;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-primary-800 dark:hover:bg-primary-950/20"
  >
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-neutral-950 dark:text-primary-300">
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <Typography variant="body" weight="semibold" className="break-words">
        {label}
      </Typography>
      <Typography variant="caption" color="gray">
        {description}
      </Typography>
    </div>
  </Link>
);

const EmptyLine = ({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-dashed border-neutral-200 p-5 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
    <Icon size={22} className="mt-0.5 shrink-0" />
    <div>
      <Typography variant="body" weight="semibold" color="neutral">
        {title}
      </Typography>
      <Typography variant="caption" color="gray" className="mt-1 block">
        {description}
      </Typography>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 rounded-2xl bg-white p-6 min-h-screen dark:bg-neutral-950">
    <div className="space-y-2">
      <Skeleton width={260} height={36} />
      <Skeleton width={520} height={18} />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} height={142} />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.9fr]">
      <Skeleton height={360} />
      <Skeleton height={360} />
    </div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <Skeleton height={320} />
      <Skeleton height={320} />
    </div>
  </div>
);
