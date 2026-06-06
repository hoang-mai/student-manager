"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineAcademicCap,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineChevronRight,
  HiOutlineClipboardList,
  HiOutlineIdentification,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import AnimatedContainer from "@/library/AnimatedContainer";
import Badge, { BadgeVariant } from "@/library/Badge";
import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { academicResultService } from "@/services/academic-results";
import { authService } from "@/services/auth";
import { cutRiceService } from "@/services/cut-rice";
import { notificationService } from "@/services/notifications";
import { timeTableService } from "@/services/time-tables";
import { tuitionFeeService } from "@/services/tuition-fees";
import type { CutRice, MealDayKey, MealSlotKey } from "@/types/cut-rice";
import type { Notification } from "@/types/notifications";
import type { ScheduleItem } from "@/types/time-tables";
import type { TuitionFee } from "@/types/tuition-fees";
import { formatDateTime, formatScore, formatSemesterYear } from "@/utils/fn-common";

const mealDays: MealDayKey[] = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const mealSlots: MealSlotKey[] = ["morning", "noon", "evening"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const getCutMealCount = (record?: CutRice) =>
  mealDays.reduce((total, day) => {
    const weekly = record?.weekly || {};
    const slot = weekly[day] || weekly[day.toLowerCase()] || {};
    return total + mealSlots.reduce((sum, meal) => sum + Number(Boolean(slot[meal])), 0);
  }, 0);

const getScheduleLabel = (schedule: ScheduleItem) =>
  `${schedule.day} · ${schedule.startTime} - ${schedule.endTime}`;

export default function StudentDashboard() {
  const profileQuery = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: authService.getProfile,
  });

  const academicQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_RESULTS, "dashboard"],
    queryFn: () => academicResultService.getAcademicResults({ fetchAll: true }),
  });

  const timeTableQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_TIME_TABLE, "dashboard"],
    queryFn: () => timeTableService.getMyTimeTables({ fetchAll: true }),
  });

  const cutRiceQuery = useQuery({
    queryKey: [QUERY_KEYS.CUT_RICE, "student-dashboard"],
    queryFn: cutRiceService.getMyCutRice,
  });

  const tuitionQuery = useQuery({
    queryKey: [QUERY_KEYS.TUITION_FEES, "student-dashboard"],
    queryFn: () => tuitionFeeService.getMyTuitionFees({ fetchAll: true }),
  });

  const notificationQuery = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, "student-dashboard"],
    queryFn: () => notificationService.getNotifications({ limit: 5 }),
  });

  const unreadNotificationQuery = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS, "student-dashboard-unread"],
    queryFn: () =>
      notificationService.getNotifications({ isRead: false, fetchAll: true }),
  });

  const profile = profileQuery.data?.data;
  const student = profile?.profile;
  const academicYears = academicQuery.data?.data || [];
  const latestAcademic = academicYears[0];
  const timeTables = timeTableQuery.data?.data || [];
  const schedules = useMemo(
    () => timeTables.flatMap((timeTable) => timeTable.schedules || []),
    [timeTables]
  );
  const cutRice = cutRiceQuery.data?.data;
  const tuitionFees = tuitionQuery.data?.data || [];
  const notifications = notificationQuery.data?.data || [];

  const tuitionSummary = useMemo(() => {
    const unpaid = tuitionFees.filter((fee) => fee.status === "UNPAID");
    const unpaidAmount = unpaid.reduce(
      (total, fee) => total + Number(fee.totalAmount || 0),
      0
    );

    return { unpaidCount: unpaid.length, unpaidAmount };
  }, [tuitionFees]);

  const academicSummary = useMemo(() => {
    const semesters = academicYears.flatMap((year) => year.semesterResults || []);
    const subjects = semesters.flatMap((semester) => semester.subjectResults || []);
    const passedSubjects = academicYears.reduce(
      (total, year) => total + (year.passedSubjects ?? 0),
      0
    );
    const failedSubjects = academicYears.reduce(
      (total, year) => total + (year.failedSubjects ?? 0),
      0
    );

    return {
      cpa4: latestAcademic?.cumulativeGrade4 ?? student?.currentCpa4,
      credits:
        latestAcademic?.cumulativeCredits ??
        latestAcademic?.totalCredits ??
        subjects.reduce((total, subject) => total + (subject.credits ?? 0), 0),
      passedSubjects,
      failedSubjects,
      subjects: subjects.length || latestAcademic?.totalSubjects || 0,
    };
  }, [academicYears, latestAcademic, student?.currentCpa4]);

  const unreadCount = unreadNotificationQuery.data?.pagination.total || 0;
  const cutMealCount = getCutMealCount(cutRice);

  const isLoading =
    profileQuery.isLoading ||
    academicQuery.isLoading ||
    timeTableQuery.isLoading ||
    cutRiceQuery.isLoading ||
    tuitionQuery.isLoading ||
    notificationQuery.isLoading ||
    unreadNotificationQuery.isLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <AnimatedContainer
      variant="slideUp"
      className="min-h-screen space-y-6 rounded-2xl bg-white p-6 text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100"
    >
      <header className="flex flex-col gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Typography variant="label" color="primary" tracking="wide">
            Tổng quan sinh viên
          </Typography>
          <Typography variant="h1" transform="uppercase" className="mt-2">
            {student?.fullName || profile?.username || "Học viên"}
          </Typography>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="primary" className="gap-1.5">
              <HiOutlineIdentification size={13} />
              {student?.code || "---"}
            </Badge>
            <Badge variant={profile?.isActive ? "success" : "error"}>
              {profile?.isActive ? "Đang học tập" : "Tài khoản bị khóa"}
            </Badge>
            {student?.class?.className && (
              <Badge variant="secondary">{student.class.className}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <QuickLink href="/student/time-table" label="Lịch học" icon={HiOutlineCalendar} />
          <QuickLink href="/student/results" label="Kết quả" icon={HiOutlineAcademicCap} />
          <QuickLink href="/student/meal-schedules" label="Cắt cơm" icon={HiOutlineClipboardList} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="CPA hệ 4"
          value={formatScore(academicSummary.cpa4)}
          helper={`${academicSummary.credits || 0} tín chỉ tích lũy`}
          icon={HiOutlineChartBar}
          tone="primary"
        />
        <SummaryCard
          label="Môn đã đạt"
          value={academicSummary.passedSubjects.toLocaleString("vi-VN")}
          helper={`${academicSummary.subjects} môn đã ghi nhận`}
          icon={HiOutlineCheckCircle}
          tone="success"
        />
        <SummaryCard
          label="Lịch học"
          value={schedules.length.toLocaleString("vi-VN")}
          helper={`${timeTables.length} bản ghi thời khóa biểu`}
          icon={HiOutlineCalendar}
          tone="secondary"
        />
        <SummaryCard
          label="Học phí chưa đóng"
          value={tuitionSummary.unpaidCount.toLocaleString("vi-VN")}
          helper={formatCurrency(tuitionSummary.unpaidAmount)}
          icon={HiOutlineCash}
          tone={tuitionSummary.unpaidCount ? "warning" : "neutral"}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Panel
          title="Lịch học gần đây"
          href="/student/time-table"
          icon={HiOutlineCalendar}
          actionLabel="Xem lịch"
        >
          {schedules.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {schedules.slice(0, 6).map((schedule, index) => (
                <div
                  key={`${schedule.day}-${schedule.startTime}-${schedule.room}-${index}`}
                  className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
                >
                  <Typography variant="body" weight="black" className="text-neutral-900 dark:text-neutral-100">
                    {schedule.subjectName || "Môn học"}
                  </Typography>
                  <Typography variant="caption" className="mt-2 block text-neutral-500 dark:text-neutral-400">
                    {getScheduleLabel(schedule)}
                  </Typography>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {schedule.room && <Badge variant="secondary">Phòng {schedule.room}</Badge>}
                    {schedule.week && <Badge variant="neutral">Tuần {schedule.week}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlock text="Chưa có lịch học được ghi nhận" />
          )}
        </Panel>

        <div className="space-y-6">
          <Panel
            title="Lịch cắt cơm"
            href="/student/meal-schedules"
            icon={HiOutlineClipboardList}
            actionLabel="Chi tiết"
          >
            <div className="grid grid-cols-2 gap-3">
              <MetricPill label="Bữa cắt" value={`${cutMealCount}/21`} />
              <MetricPill
                label="Trạng thái"
                value={cutRice?.isAutoGenerated ? "Tự động" : "Thủ công"}
              />
            </div>
            <Typography variant="caption" className="mt-4 block text-neutral-500 dark:text-neutral-400">
              Cập nhật:{" "}
              {cutRice?.lastUpdated
                ? formatDateTime(cutRice.lastUpdated)
                : cutRice?.updatedAt
                  ? formatDateTime(cutRice.updatedAt)
                  : "Chưa có dữ liệu"}
            </Typography>
          </Panel>

          <Panel
            title="Thông báo"
            href="/student/notification"
            icon={HiOutlineBell}
            actionLabel="Xem tất cả"
          >
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-primary-100 bg-primary-50 p-3 dark:border-primary-700/60 dark:bg-primary-950/40">
              <Typography variant="caption" weight="black" className="text-primary-700 dark:text-primary-100">
                Chưa đọc
              </Typography>
              <Badge variant={unreadCount ? "primary" : "neutral"}>
                {unreadCount.toLocaleString("vi-VN")}
              </Badge>
            </div>
            <NotificationList notifications={notifications} />
          </Panel>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel title="Kết quả học tập" href="/student/results" icon={HiOutlineAcademicCap} actionLabel="Xem điểm">
          <div className="grid grid-cols-3 gap-3">
            <MetricPill label="Môn học" value={academicSummary.subjects.toLocaleString("vi-VN")} />
            <MetricPill label="Môn đạt" value={academicSummary.passedSubjects.toLocaleString("vi-VN")} />
            <MetricPill label="Môn nợ" value={academicSummary.failedSubjects.toLocaleString("vi-VN")} />
          </div>
          <div className="mt-4 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
            <Typography variant="caption" color="gray">
              Năm học mới nhất
            </Typography>
            <Typography variant="body" weight="black" className="mt-1 text-neutral-900 dark:text-neutral-100">
              {latestAcademic?.schoolYear || "---"}
            </Typography>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="primary">CPA 4: {formatScore(latestAcademic?.cumulativeGrade4)}</Badge>
              <Badge variant="secondary">CPA 10: {formatScore(latestAcademic?.cumulativeGrade10)}</Badge>
            </div>
          </div>
        </Panel>

        <Panel title="Học phí" href="/student/tuition" icon={HiOutlineCash} actionLabel="Xem học phí">
          {tuitionFees.length ? (
            <div className="space-y-3">
              {tuitionFees.slice(0, 4).map((fee) => (
                <div
                  key={fee.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
                >
                  <div className="min-w-0">
                    <Typography variant="body" weight="black" className="truncate text-neutral-900 dark:text-neutral-100">
                      {getTuitionLabel(fee)}
                    </Typography>
                    <Typography variant="caption" className="mt-1 block text-neutral-500 dark:text-neutral-400">
                      {fee.content || "---"}
                    </Typography>
                  </div>
                  <div className="shrink-0 text-right">
                    <Typography variant="caption" weight="black" className="text-neutral-600 dark:text-neutral-300">
                      {formatCurrency(Number(fee.totalAmount || 0))}
                    </Typography>
                    <Badge variant={fee.status === "PAID" ? "success" : "warning"} className="mt-2">
                      {fee.status === "PAID" ? "Đã đóng" : "Chưa đóng"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlock text="Chưa có khoản học phí" />
          )}
        </Panel>
      </section>
    </AnimatedContainer>
  );
}

const getTuitionLabel = (fee: TuitionFee) => {
  const semester = fee.semesterInfo?.code || fee.semester;
  const schoolYear = fee.semesterInfo?.schoolYearInfo?.schoolYear || fee.schoolYear;
  if (semester && schoolYear) return formatSemesterYear(semester, schoolYear);
  return semester || schoolYear || "Khoản học phí";
};

const toneClasses: Record<
  "primary" | "secondary" | "success" | "warning" | "neutral",
  string
> = {
  primary: "border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-700/60 dark:bg-primary-950/40 dark:text-primary-100",
  secondary: "border-secondary-100 bg-secondary-50 text-secondary-700 dark:border-secondary-700/60 dark:bg-secondary-950/40 dark:text-secondary-100",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100",
  neutral: "border-neutral-100 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
};

const SummaryCard = ({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  icon: IconType;
  tone: keyof typeof toneClasses;
}) => (
  <div className={`rounded-2xl border p-4 shadow-sm ${toneClasses[tone]}`}>
    <div className="flex items-center justify-between gap-3">
      <Typography variant="caption" weight="black" className="opacity-80">
        {label}
      </Typography>
      <Icon size={20} className="shrink-0 opacity-80" />
    </div>
    <p className="mt-3 text-3xl font-black leading-none">{value}</p>
    <p className="mt-2 text-xs font-bold opacity-70">{helper}</p>
  </div>
);

const Panel = ({
  title,
  href,
  icon: Icon,
  actionLabel,
  children,
}: {
  title: string;
  href: string;
  icon: IconType;
  actionLabel: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
          <Icon size={20} />
        </div>
        <Typography variant="h3" className="truncate text-neutral-900 dark:text-neutral-100">
          {title}
        </Typography>
      </div>
      <Link
        href={href}
        className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-neutral-200 px-3 text-[10px] font-black uppercase tracking-wider text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-primary-600 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
      >
        {actionLabel}
        <HiOutlineChevronRight size={14} />
      </Link>
    </div>
    {children}
  </section>
);

const QuickLink = ({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: IconType;
}) => (
  <Link
    href={href}
    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
  >
    <Icon size={16} />
    {label}
  </Link>
);

const MetricPill = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/70">
    <Typography variant="caption" color="gray">
      {label}
    </Typography>
    <Typography variant="body" weight="black" className="mt-1 text-neutral-900 dark:text-neutral-100">
      {value}
    </Typography>
  </div>
);

const NotificationList = ({ notifications }: { notifications: Notification[] }) => {
  if (!notifications.length) return <EmptyBlock text="Chưa có thông báo" />;

  return (
    <div className="space-y-3">
      {notifications.slice(0, 4).map((notification) => (
        <div
          key={notification.id}
          className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/70"
        >
          <div className="flex items-start justify-between gap-3">
            <Typography variant="body" weight="black" className="line-clamp-1 text-neutral-900 dark:text-neutral-100">
              {notification.title}
            </Typography>
            <Badge variant={getNotificationVariant(notification.type)} className="shrink-0">
              {notification.isRead ? "Đã đọc" : "Mới"}
            </Badge>
          </div>
          {notification.content && (
            <Typography variant="caption" className="mt-2 block line-clamp-2 text-neutral-500 dark:text-neutral-400">
              {notification.content}
            </Typography>
          )}
        </div>
      ))}
    </div>
  );
};

const getNotificationVariant = (type?: string | null): BadgeVariant => {
  if (type === "TUITION") return "secondary";
  if (type === "CUT_RICE") return "warning";
  if (type === "ACHIEVEMENT") return "success";
  if (type === "GRADE") return "primary";
  return "neutral";
};

const EmptyBlock = ({ text }: { text: string }) => (
  <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/70 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
    <Typography variant="caption" className="text-neutral-500 dark:text-neutral-400">
      {text}
    </Typography>
  </div>
);

const DashboardSkeleton = () => (
  <AnimatedContainer
    variant="slideUp"
    className="min-h-screen space-y-6 rounded-2xl bg-white p-6 dark:bg-neutral-950"
  >
    <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800">
      <Skeleton variant="text" width={150} height={16} />
      <Skeleton variant="text" width={320} height={32} />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={90} height={24} />
        <Skeleton variant="rounded" width={120} height={24} />
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={130} />
      ))}
    </div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
      <Skeleton variant="rounded" height={360} />
      <div className="space-y-6">
        <Skeleton variant="rounded" height={160} />
        <Skeleton variant="rounded" height={260} />
      </div>
    </div>
  </AnimatedContainer>
);
