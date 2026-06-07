"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineCollection,
  HiOutlineExclamation,
  HiOutlineIdentification,
  HiOutlineOfficeBuilding,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import AnimatedContainer from "@/library/AnimatedContainer";
import Badge from "@/library/Badge";
import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { dashboardService } from "@/services/dashboard";
import { DashboardChartItem } from "@/types/dashboard";
import { formatDateTime } from "@/utils/fn-common";

const formatNumber = (value?: number) => (value ?? 0).toLocaleString("vi-VN");

export default function AdminDashboard() {
  const dashboardQuery = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD],
    queryFn: dashboardService.getAdminDashboard,
  });

  const dashboard = dashboardQuery.data?.data;

  if (dashboardQuery.isLoading) return <DashboardSkeleton />;

  return (
    <AnimatedContainer
      variant="slideUp"
      className="min-h-screen space-y-6 rounded-2xl bg-white p-6 text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100"
    >
      <header className="border-b border-neutral-100 pb-6 dark:border-neutral-800">
        <Typography variant="label" color="primary" tracking="wide">
          Dashboard quản trị viên
        </Typography>
        <Typography variant="h1" className="mt-2">
          Tổng quan hệ thống
        </Typography>
        <Typography variant="body" color="gray" className="mt-2 block">
          Theo dõi tài khoản, dữ liệu nền và các cảnh báo vận hành.
        </Typography>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Tài khoản" value={dashboard?.overview.totalUsers} helper="Tổng người dùng" icon={HiOutlineUserGroup} tone="primary" />
        <SummaryCard label="Đang hoạt động" value={dashboard?.overview.activeUsers} helper="Tài khoản khả dụng" icon={HiOutlineCheckCircle} tone="success" />
        <SummaryCard label="Bị khóa" value={dashboard?.overview.inactiveUsers} helper="Cần rà soát" icon={HiOutlineExclamation} tone="warning" />
        <SummaryCard label="Thiếu hồ sơ" value={dashboard?.overview.usersWithoutProfile} helper="User chưa gắn profile" icon={HiOutlineIdentification} tone="error" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Cơ sở đào tạo" value={dashboard?.overview.totalUniversities} helper="Trường/đơn vị cấp trường" icon={HiOutlineOfficeBuilding} tone="primary" href="/admin/universities" />
        <SummaryCard label="Khoa/Đơn vị" value={dashboard?.overview.totalOrganizations} helper="Đơn vị trực thuộc" icon={HiOutlineCollection} tone="success" href="/admin/universities" />
        <SummaryCard label="Lớp học" value={dashboard?.overview.totalClasses} helper="Lớp đang quản lý" icon={HiOutlineAcademicCap} tone="warning" href="/admin/classes" />
        <SummaryCard label="Học viên" value={dashboard?.overview.totalStudents} helper="Tài khoản học viên" icon={HiOutlineIdentification} tone="primary" href="/admin/accounts" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ManagementLink
          href="/admin/universities"
          icon={HiOutlineOfficeBuilding}
          title="Cơ sở đào tạo"
          description={`${formatNumber(dashboard?.overview.totalUniversities)} trường, ${formatNumber(dashboard?.overview.totalOrganizations)} khoa/đơn vị`}
        />
        <ManagementLink
          href="/admin/classes"
          icon={HiOutlineAcademicCap}
          title="Quản lý lớp học"
          description={`${formatNumber(dashboard?.overview.totalClasses)} lớp, gắn với trình độ đào tạo`}
        />
        <ManagementLink
          href="/admin/accounts"
          icon={HiOutlineUserGroup}
          title="Quản lý tài khoản"
          description={`${formatNumber(dashboard?.overview.totalUsers)} tài khoản, ${formatNumber(dashboard?.overview.activeUsers)} đang hoạt động`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Panel title="Người dùng theo vai trò">
          <HorizontalBars data={dashboard?.charts.usersByRole || []} color="bg-primary-500" />
        </Panel>
        <Panel title="Trạng thái tài khoản">
          <HorizontalBars data={dashboard?.charts.userStatus || []} color="bg-emerald-500" />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel title="Dữ liệu nền">
          <VerticalBars data={dashboard?.charts.masterData || []} />
        </Panel>
        <Panel title="Bản ghi theo phân hệ">
          <VerticalBars data={dashboard?.charts.recordsByModule || []} />
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel title="Cảnh báo quản trị">
          <div className="space-y-3">
            <AlertLine icon={HiOutlineExclamation} label="Tài khoản bị khóa" value={dashboard?.alerts.inactiveUsers || 0} />
            <AlertLine icon={HiOutlineIdentification} label="User thiếu hồ sơ" value={dashboard?.alerts.usersWithoutProfile || 0} />
            <AlertLine icon={HiOutlineShieldCheck} label="Đề xuất chờ duyệt" value={dashboard?.alerts.pendingGradeRequests || 0} />
          </div>
        </Panel>

        <Panel title="Tài khoản mới tạo">
          <div className="space-y-3">
            {dashboard?.recent.users.length ? (
              dashboard.recent.users.map((user) => (
                <Link
                  key={user.id}
                  href="/admin/accounts"
                  className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/50 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                  <div className="min-w-0">
                    <Typography variant="body" weight="semibold" className="break-words">
                      {user.fullName || user.username}
                    </Typography>
                    <Typography variant="caption" color="gray" className="mt-1 block">
                      {user.code || user.username} - {user.role}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.isActive ? "success" : "warning"}>
                      {user.isActive ? "Hoạt động" : "Đã khóa"}
                    </Badge>
                    <Typography variant="caption" color="gray" className="mt-2 block">
                      {formatDateTime(user.createdAt)}
                    </Typography>
                  </div>
                </Link>
              ))
            ) : (
              <Typography variant="body" color="gray">
                Chưa có tài khoản mới.
              </Typography>
            )}
          </div>
        </Panel>
      </section>
    </AnimatedContainer>
  );
}

const toneClass = {
  primary: "border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
  error: "border-error-100 bg-error-50 text-error-700 dark:border-error-800 dark:bg-error-950/40 dark:text-error-100",
};

const SummaryCard = ({ label, value, helper, icon: Icon, tone, href }: {
  label: string;
  value?: number;
  helper: string;
  icon: IconType;
  tone: keyof typeof toneClass;
  href?: string;
}) => {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <Typography variant="label" weight="bold" className="opacity-80">
            {label}
          </Typography>
          <div className="mt-3 text-3xl font-black leading-none">{formatNumber(value)}</div>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/70 shadow-sm dark:bg-neutral-950/40">
          <Icon size={20} />
        </div>
      </div>
      <Typography variant="caption" className="mt-3 block opacity-75">
        {helper}
      </Typography>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`block rounded-2xl border p-5 transition-transform hover:-translate-y-0.5 ${toneClass[tone]}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 ${toneClass[tone]}`}>
      {content}
    </div>
  );
};

const ManagementLink = ({ href, icon: Icon, title, description }: {
  href: string;
  icon: IconType;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="group flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-neutral-50/70 p-5 transition-colors hover:border-primary-200 hover:bg-primary-50/60 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-primary-800 dark:hover:bg-primary-950/30"
  >
    <div className="flex min-w-0 items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm dark:bg-neutral-950 dark:text-primary-300">
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <Typography variant="body" weight="bold" color="neutral">
          {title}
        </Typography>
        <Typography variant="caption" color="gray" className="mt-1 block">
          {description}
        </Typography>
      </div>
    </div>
    <span className="text-lg font-black text-neutral-300 transition-colors group-hover:text-primary-500">-&gt;</span>
  </Link>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
    <Typography variant="h3" weight="bold" className="mb-4">
      {title}
    </Typography>
    {children}
  </section>
);

const HorizontalBars = ({ data, color }: { data: DashboardChartItem[]; color: string }) => {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex justify-between gap-3">
            <Typography variant="caption" weight="semibold">{item.label}</Typography>
            <Typography variant="caption" weight="bold" color="gray">{formatNumber(item.value)}</Typography>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(6, (item.value / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBars = ({ data }: { data: DashboardChartItem[] }) => {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="flex h-64 items-end gap-3 overflow-x-auto pt-6">
      {data.map((item) => (
        <div key={item.label} className="flex min-w-20 flex-1 flex-col items-center gap-2">
          <Typography variant="caption" weight="bold">{formatNumber(item.value)}</Typography>
          <div className="w-full rounded-t-xl bg-sky-500" style={{ height: Math.max(18, (item.value / max) * 190) }} />
          <Typography variant="caption" color="gray" className="line-clamp-2 min-h-9 text-center">{item.label}</Typography>
        </div>
      ))}
    </div>
  );
};

const AlertLine = ({ icon: Icon, label, value }: { icon: IconType; label: string; value: number }) => (
  <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-white text-primary-600 dark:bg-neutral-950">
        <Icon size={18} />
      </div>
      <Typography variant="body" weight="semibold">{label}</Typography>
    </div>
    <Badge variant={value ? "warning" : "success"}>{formatNumber(value)}</Badge>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6 rounded-2xl bg-white p-6 dark:bg-neutral-950">
    <Skeleton width={320} height={40} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height={140} />)}
    </div>
    <div className="grid gap-6 xl:grid-cols-2">
      <Skeleton height={300} />
      <Skeleton height={300} />
    </div>
  </div>
);
