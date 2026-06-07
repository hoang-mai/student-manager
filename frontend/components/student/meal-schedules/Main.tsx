"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from "react-icons/hi";
import Badge from "@/library/Badge";
import PageContainer from "@/library/PageContainer";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { cutRiceService } from "@/services/cut-rice";
import { CutRice, MealDayKey, MealSlotKey } from "@/types/cut-rice";
import { formatDateTime } from "@/utils/fn-common";
import MealScheduleSkeleton from "./MealScheduleSkeleton";

const mealDays: MealDayKey[] = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

const mealSlots: Array<{ key: MealSlotKey; label: string; time: string }> = [
  { key: "morning", label: "Bữa sáng", time: "06:00" },
  { key: "noon", label: "Bữa trưa", time: "11:00" },
  { key: "evening", label: "Bữa tối", time: "17:30" },
];

const getSlot = (record: CutRice | undefined, day: MealDayKey) => {
  const weekly = record?.weekly || {};
  return weekly[day] || weekly[day.toLowerCase()] || {};
};

const getCutRiceUser = (record?: CutRice) => record?.User || record?.user;
const getCutRiceProfile = (record?: CutRice) => {
  const user = getCutRiceUser(record);
  return user?.Profile || user?.profile;
};

export default function Main() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.CUT_RICE, "student"],
    queryFn: cutRiceService.getMyCutRice,
  });

  const cutRice = data?.data;

  const summary = useMemo(() => {
    const totalSlots = mealDays.length * mealSlots.length;
    const cutCount = mealDays.reduce((total, day) => {
      const slot = getSlot(cutRice, day);
      return (
        total +
        mealSlots.reduce(
          (dayTotal, meal) => dayTotal + Number(Boolean(slot[meal.key])),
          0
        )
      );
    }, 0);

    return {
      totalSlots,
      cutCount,
      activeDays: mealDays.filter((day) => {
        const slot = getSlot(cutRice, day);
        return mealSlots.some((meal) => slot[meal.key]);
      }).length,
    };
  }, [cutRice]);

  return (
    <PageContainer
      breadcrumb={[
        { label: "Trang chủ", href: "/student" },
        { label: "Lịch cắt cơm" },
      ]}
      title="Lịch cắt cơm"
      subtitle="Theo dõi lịch cắt cơm cá nhân được tính từ lịch học và thời gian di chuyển."
      isLoading={isLoading}
      skeleton={<MealScheduleSkeleton />}
      isError={isError}
      errorMessage={error?.message}
      onRetry={refetch}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-700/80 dark:bg-neutral-900">
          <Typography variant="caption" weight="bold" className="text-neutral-500 dark:text-neutral-400">
            Học viên
          </Typography>
          <Typography variant="h4" className="mt-1 text-neutral-900 dark:text-neutral-100">
            {getCutRiceProfile(cutRice)?.fullName ||
              getCutRiceUser(cutRice)?.username ||
              "Chưa có tên học viên"}
          </Typography>
          <Typography variant="body" className="mt-1 text-neutral-500 dark:text-neutral-400">
            {getCutRiceProfile(cutRice)?.code || "Chưa có mã học viên"}
          </Typography>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-primary-100 bg-primary-50 p-4 dark:border-primary-700/60 dark:bg-primary-950/40">
            <div className="flex items-center gap-2 text-primary-700 dark:text-primary-100">
              <HiOutlineCalendar size={18} />
              <Typography variant="caption" weight="bold">
                Tổng bữa cắt
              </Typography>
            </div>
            <Typography variant="h2" className="mt-2 text-primary-700 dark:text-primary-100">
              {summary.cutCount}/{summary.totalSlots}
            </Typography>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-700/60 dark:bg-emerald-950/40">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-100">
              <HiOutlineCheckCircle size={18} />
              <Typography variant="caption" weight="bold">
                Ngày có lịch cắt
              </Typography>
            </div>
            <Typography variant="h2" className="mt-2 text-emerald-700 dark:text-emerald-100">
              {summary.activeDays}/7
            </Typography>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-700/60 dark:bg-amber-950/40">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-100">
              <HiOutlineClock size={18} />
              <Typography variant="caption" weight="bold">
                Cập nhật
              </Typography>
            </div>
            <Typography variant="body" weight="black" className="mt-3 text-amber-700 dark:text-amber-100">
              {cutRice?.lastUpdated
                ? formatDateTime(cutRice.lastUpdated)
                : cutRice?.updatedAt
                  ? formatDateTime(cutRice.updatedAt)
                  : "Chưa có dữ liệu"}
            </Typography>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant={cutRice?.isAutoGenerated ? "success" : "warning"}>
            {cutRice?.isAutoGenerated ? "Tự động" : "Thủ công"}
          </Badge>
          <Badge variant="secondary">
            {cutRice?.notes || "Không có ghi chú"}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mealDays.map((day) => {
            const slot = getSlot(cutRice, day);
            const cutMeals = mealSlots.filter((meal) => slot[meal.key]).length;

            return (
              <div
                key={day}
                className="rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm transition-colors dark:border-neutral-700/80 dark:bg-neutral-900 dark:shadow-black/20"
              >
                <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-700/80">
                  <Typography variant="body" weight="bold" className="text-neutral-900 dark:text-neutral-100">
                    {day}
                  </Typography>
                  <Badge
                    variant={cutMeals ? "success" : "secondary"}
                    className={
                      cutMeals
                        ? "dark:border-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100"
                        : "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    }
                  >
                    {cutMeals}/3 bữa
                  </Badge>
                </div>

                <div className="space-y-3">
                  {mealSlots.map((meal) => {
                    const isCut = Boolean(slot[meal.key]);
                    const StatusIcon = isCut ? HiOutlineXCircle : HiOutlineCheckCircle;

                    return (
                      <div
                        key={meal.key}
                        className={`flex items-center justify-between gap-3 rounded-2xl border p-3 ${
                          isCut
                            ? "border-amber-100 bg-amber-50/80 dark:border-amber-700/60 dark:bg-amber-950/40"
                            : "border-neutral-100 bg-neutral-50/70 dark:border-neutral-700/70 dark:bg-neutral-800/70"
                        }`}
                      >
                        <div className="min-w-0">
                          <Typography variant="body" weight="semibold" className="text-neutral-900 dark:text-neutral-100">
                            {meal.label}
                          </Typography>
                          <Typography variant="caption" className="text-neutral-500 dark:text-neutral-400">
                            {meal.time}
                          </Typography>
                        </div>
                        <Badge
                          variant={isCut ? "warning" : "neutral"}
                          className="shrink-0 gap-1.5 whitespace-nowrap"
                        >
                          <StatusIcon size={13} />
                          {isCut ? "Cắt cơm" : "Không cắt"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
