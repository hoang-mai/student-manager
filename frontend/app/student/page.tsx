"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineAcademicCap,
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineIdentification,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import AnimatedContainer from "@/library/AnimatedContainer";
import Badge from "@/library/Badge";
import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { dashboardService } from "@/services/dashboard";
import { DashboardChartItem } from "@/types/dashboard";
import {
  formatCurrency,
  formatDateTime,
  formatScore,
  formatSemesterYear,
} from "@/utils/fn-common";

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("vi-VN");

export default function StudentDashboard() {
  const dashboardQuery = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_DASHBOARD],
    queryFn: dashboardService.getStudentDashboard,
  });

  const dashboard = dashboardQuery.data?.data;
  const profile = dashboard?.profile;

  if (dashboardQuery.isLoading) return <DashboardSkeleton />;

  return (
    <AnimatedContainer
      variant="slideUp"
      className="min-h-screen space-y-6 rounded-2xl bg-white p-6 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
    >
      <header className="flex flex-col gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Typography variant="label" color="primary" tracking="wide">
            Dashboard học viên
          </Typography>
          <Typography variant="h1" transform="uppercase" className="mt-2">
            {profile?.fullName || profile?.username || "Học viên"}
          </Typography>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="primary" className="gap-1.5">
              <HiOutlineIdentification size={13} />
              {profile?.code || "---"}
            </Badge>
            <Badge variant={profile?.isActive ? "success" : "error"}>
              {profile?.isActive ? "Đang học tập" : "Tài khoản bị khóa"}
            </Badge>
            {profile?.className && <Badge variant="secondary">{profile.className}</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <QuickLink href="/student/time-table" label="Lịch học" icon={HiOutlineCalendar} />
          <QuickLink href="/student/results" label="Kết quả" icon={HiOutlineAcademicCap} />
          <QuickLink href="/student/tuition" label="Học phí" icon={HiOutlineCash} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="CPA hệ 4" value={formatScore(dashboard?.overview.cpa4)} helper={`${dashboard?.overview.credits || 0} tín chỉ tích lũy`} icon={HiOutlineChartBar} tone="primary" />
        <SummaryCard label="Môn đã đạt" value={formatNumber(dashboard?.overview.passedSubjects)} helper={`${dashboard?.overview.failedSubjects || 0} môn chưa đạt`} icon={HiOutlineCheckCircle} tone="success" />
        <SummaryCard label="Lịch học" value={formatNumber(dashboard?.overview.scheduleCount)} helper={`${dashboard?.overview.cutMealCount || 0} bữa cắt cơm`} icon={HiOutlineCalendar} tone="secondary" />
        <SummaryCard label="Học phí chưa nộp" value={formatNumber(dashboard?.overview.unpaidTuitionCount)} helper={formatCurrency(dashboard?.overview.unpaidTuitionAmount || 0)} icon={HiOutlineCash} tone={dashboard?.overview.unpaidTuitionCount ? "warning" : "neutral"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Tiến độ CPA theo năm">
          <VerticalBars data={dashboard?.charts.academicTrend || []} />
        </Panel>
        <Panel title="Tổng quan học tập">
          <HorizontalBars data={dashboard?.charts.subjectStatus || []} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel title="Lịch học gần đây" href="/student/time-table">
          <div className="space-y-3">
            {dashboard?.recent.schedules.length ? (
              dashboard.recent.schedules.map((schedule, index) => (
                <div key={`${schedule.day}-${schedule.startTime}-${index}`} className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <Typography variant="body" weight="semibold">
                    {schedule.subjectName || "Môn học"}
                  </Typography>
                  <Typography variant="caption" color="gray" className="mt-1 block">
                    {schedule.day} - {schedule.startTime} đến {schedule.endTime}
                  </Typography>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {schedule.room && <Badge variant="secondary">Phòng {schedule.room}</Badge>}
                    {schedule.week && <Badge variant="neutral">Tuần {schedule.week}</Badge>}
                  </div>
                </div>
              ))
            ) : (
              <EmptyLine icon={HiOutlineCalendar} text="Chưa có lịch học." />
            )}
          </div>
        </Panel>

        <Panel title="Học phí của tôi" href="/student/tuition">
          <div className="space-y-3">
            {dashboard?.recent.tuition.length ? (
              dashboard.recent.tuition.map((fee) => (
                <div key={fee.id} className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <div className="min-w-0">
                    <Typography variant="body" weight="semibold">
                      {formatCurrency(fee.amount)}
                    </Typography>
                    <Typography variant="caption" color="gray" className="mt-1 block">
                      {formatSemesterYear(String(fee.semester), fee.schoolYear)}
                    </Typography>
                  </div>
                  <Badge variant={fee.status === "PAID" ? "success" : "warning"}>
                    {fee.status === "PAID" ? "Đã nộp" : "Chưa nộp"}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyLine icon={HiOutlineCash} text="Chưa có bản ghi học phí." />
            )}
          </div>
        </Panel>

        <Panel title="Thông báo mới" href="/student/notification">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-primary-50 p-3 text-primary-700 dark:bg-primary-950/40 dark:text-primary-100">
            <Typography variant="caption" weight="bold">
              Chưa đọc
            </Typography>
            <Badge variant="primary">{formatNumber(dashboard?.overview.unreadNotifications)}</Badge>
          </div>
          <div className="space-y-3">
            {dashboard?.recent.notifications.length ? (
              dashboard.recent.notifications.map((notification) => (
                <div key={notification.id} className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                  <Typography variant="body" weight="semibold">
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="gray" className="mt-1 block">
                    {formatDateTime(notification.createdAt)}
                  </Typography>
                </div>
              ))
            ) : (
              <EmptyLine icon={HiOutlineBell} text="Chưa có thông báo." />
            )}
          </div>
        </Panel>
      </section>
    </AnimatedContainer>
  );
}

const cardTone = {
  primary: "border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
  secondary: "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100",
  neutral: "border-neutral-100 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
};

const SummaryCard = ({ label, value, helper, icon: Icon, tone }: {
  label: string;
  value: string;
  helper: string;
  icon: IconType;
  tone: keyof typeof cardTone;
}) => (
  <div className={`rounded-2xl border p-5 ${cardTone[tone]}`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <Typography variant="label" weight="bold" className="opacity-80">{label}</Typography>
        <div className="mt-3 text-3xl font-black leading-none">{value}</div>
      </div>
      <div className="flex size-10 items-center justify-center rounded-xl bg-white/70 shadow-sm dark:bg-neutral-950/40">
        <Icon size={20} />
      </div>
    </div>
    <Typography variant="caption" className="mt-3 block opacity-75">{helper}</Typography>
  </div>
);

const QuickLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: IconType }) => (
  <Link href={href} className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-neutral-800 dark:text-neutral-200">
    <Icon size={18} />
    {label}
  </Link>
);

const Panel = ({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
    <div className="mb-4 flex items-center justify-between gap-4">
      <Typography variant="h3" weight="bold">{title}</Typography>
      {href && <Link href={href} className="text-sm font-bold text-primary-600">Xem thêm</Link>}
    </div>
    {children}
  </section>
);

const HorizontalBars = ({ data }: { data: DashboardChartItem[] }) => {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between">
            <Typography variant="caption" weight="semibold">{item.label}</Typography>
            <Typography variant="caption" weight="bold" color="gray">{formatNumber(item.value)}</Typography>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBars = ({ data }: { data: DashboardChartItem[] }) => {
  const max = Math.max(...data.map((item) => item.value), 1);
  if (!data.length) return <EmptyLine icon={HiOutlineChartBar} text="Chưa có dữ liệu học tập." />;
  return (
    <div className="flex h-64 items-end gap-3 overflow-x-auto pt-6">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-20 flex-1 flex-col items-center gap-2">
          <Typography variant="caption" weight="bold">{formatScore(item.value)}</Typography>
          <div className="w-full rounded-t-xl bg-sky-500" style={{ height: Math.max(18, (item.value / max) * 190) }} />
          <Typography variant="caption" color="gray" className="line-clamp-2 min-h-9 text-center">{item.label}</Typography>
        </div>
      ))}
    </div>
  );
};

const EmptyLine = ({ icon: Icon, text }: { icon: IconType; text: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-dashed border-neutral-200 p-5 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
    <Icon size={22} />
    <Typography variant="body" color="gray">{text}</Typography>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 rounded-2xl bg-white p-6 dark:bg-neutral-950">
    <Skeleton width={320} height={40} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height={140} />)}
    </div>
    <div className="grid gap-6 xl:grid-cols-3">
      <Skeleton height={320} />
      <Skeleton height={320} />
      <Skeleton height={320} />
    </div>
  </div>
);
