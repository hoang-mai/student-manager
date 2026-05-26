"use client";

import { useQuery } from "@tanstack/react-query";
import PageContainer from "@/library/PageContainer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { timeTableService } from "@/services/time-tables";
import TimeTableCalendar from "./TimeTableCalendar";
import TimeTableSkeleton from "./TimeTableSkeleton";

export default function Main() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.STUDENT_TIME_TABLE],
    queryFn: timeTableService.getMyTimeTable,
  });

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
      {data && <TimeTableCalendar timeTable={data} />}
    </PageContainer>
  );
}
