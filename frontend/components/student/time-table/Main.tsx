"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import PageContainer from "@/library/PageContainer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { timeTableService } from "@/services/time-tables";
import { ScheduleItem, TimeTable } from "@/types/time-tables";
import TimeTableCalendar from "./TimeTableCalendar";
import TimeTableSkeleton from "./TimeTableSkeleton";

const getUniqueStringValues = (
  schedules: ScheduleItem[],
  key: "subjectName" | "room"
) =>
  Array.from(
    new Set(
      schedules
        .map((schedule) => schedule[key])
        .filter(
          (value): value is string =>
            typeof value === "string" && value.length > 0
        )
    )
  );

const getUniqueWeeks = (schedules: ScheduleItem[]) =>
  Array.from(
    new Set(
      schedules
        .flatMap((schedule) =>
          Array.isArray(schedule.week) ? schedule.week : [schedule.week]
        )
        .filter((value): value is number => typeof value === "number")
    )
  );

export default function Main() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_TIME_TABLE],
    queryFn: () => timeTableService.getMyTimeTables({ fetchAll: true }),
  });

  const timeTable = useMemo<TimeTable>(() => {
    const timeTables = data?.data || [];
    const schedules = timeTables.flatMap((item) => item.schedules || []);

    return {
      id: "my-time-table",
      userId: timeTables[0]?.userId || "",
      schedules,
      scheduleCount: schedules.length,
      subjectNames: getUniqueStringValues(schedules, "subjectName"),
      weeks: getUniqueWeeks(schedules),
      rooms: getUniqueStringValues(schedules, "room"),
      createdAt: timeTables[0]?.createdAt || "",
      updatedAt: timeTables[0]?.updatedAt || "",
    };
  }, [data]);

  return (
    <PageContainer
      breadcrumb={[
        { label: "Trang chủ", href: "/student" },
        { label: "Lịch học" },
      ]}
      title="Lịch học"
      subtitle="Xem lịch học cá nhân theo tuần, bao gồm môn học, thời gian và phòng học."
      isLoading={isLoading}
      skeleton={<TimeTableSkeleton />}
      isError={isError}
      errorMessage={error?.message}
      onRetry={refetch}
      className="space-y-8"
    >
      <TimeTableCalendar timeTable={timeTable} />
    </PageContainer>
  );
}
