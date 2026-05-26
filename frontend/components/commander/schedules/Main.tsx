"use client";

import { useState } from "react";
import { HiOutlineCalendar, HiOutlineRefresh } from "react-icons/hi";
import PageContainer from "@/library/PageContainer";
import Tabs from "@/library/Tabs";
import CutRiceTab from "./cut-rice/CutRiceTab";
import TimeTablesTab from "./time-table/TimeTablesTab";

export default function SchedulesMain() {
  const [activeTab, setActiveTab] = useState<"time-tables" | "cut-rice">("time-tables");

  const subtitleByTab = {
    "time-tables": "Nhập, cập nhật và theo dõi thời khóa biểu học viên theo tuần.",
    "cut-rice": "Theo dõi lịch cắt cơm, tạo tự động và xuất báo cáo Excel.",
  } satisfies Record<typeof activeTab, string>;

  const handleTabChange = (id: string) => {
    setActiveTab(id as "time-tables" | "cut-rice");
  };

  return (
    <PageContainer
      breadcrumb={[{ label: "Tổng quan", href: "/commander" }, { label: "Lịch học & Cắt cơm" }]}
      title="Lịch học & Cắt cơm"
      subtitle={subtitleByTab[activeTab]}
      className="space-y-8"
    >
      <Tabs
        activeTab={activeTab}
        onChange={handleTabChange}
        fullWidth
        tabs={[
          {
            id: "time-tables",
            label: "Lịch học",
            icon: <HiOutlineCalendar />,
            content: <TimeTablesTab />,
          },
          {
            id: "cut-rice",
            label: "Lịch cắt cơm",
            icon: <HiOutlineRefresh />,
            content: <CutRiceTab />,
          },
        ]}
      />
    </PageContainer>
  );
}
