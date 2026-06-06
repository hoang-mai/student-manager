import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  BatchTimeTableRequest,
  CreateTimeTableRequest,
  ScheduleInput,
  ScheduleItem,
  TimeTable,
  TimeTableQueryRequest,
  TimeTableReport,
  UpdateTimeTableRequest,
} from "@/types/time-tables";

const normalizeSchedule = (schedule: ScheduleInput): ScheduleItem => {
  let base: Omit<ScheduleItem, "week">;
  let week: number | number[] | null | undefined;

  if ("timeRange" in schedule) {
    const { timeRange, week: scheduleWeek, ...rest } = schedule;
    base = {
      ...rest,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
    };
    week = scheduleWeek;
  } else {
    const { week: scheduleWeek, ...rest } = schedule;
    base = rest;
    week = scheduleWeek;
  }

  return {
    ...base,
    week: Array.isArray(week) ? week : week ?? null,
  };
};

const normalizeTimeTablePayload = <
  T extends CreateTimeTableRequest | UpdateTimeTableRequest
>(
  data: T
) => ({
  ...data,
  schedules: data.schedules?.map(normalizeSchedule) ?? data.schedules,
});

export const timeTableService = {
  getTimeTables: async (
    params?: TimeTableQueryRequest
  ): Promise<PaginatedResponse<TimeTable>> => {
    return apiClient.get(ENDPOINTS.TIME_TABLES.BASE, { params });
  },

  getTimeTable: async (id: string): Promise<TimeTable> => {
    return apiClient.get(`${ENDPOINTS.TIME_TABLES.BASE}/${id}`);
  },

  getMyTimeTables: async (
    params?: TimeTableQueryRequest
  ): Promise<PaginatedResponse<TimeTable>> => {
    return apiClient.get(ENDPOINTS.TIME_TABLES.TIME_TABLE, { params });
  },

  createTimeTable: async (data: CreateTimeTableRequest) => {
    return apiClient.post(
      ENDPOINTS.TIME_TABLES.BASE,
      normalizeTimeTablePayload(data)
    );
  },

  createBatchTimeTables: async (
    data: BatchTimeTableRequest
  ): Promise<ApiResponse<BatchMutationResult>> => {
    return apiClient.post(ENDPOINTS.TIME_TABLES.BATCH, data);
  },

  updateTimeTable: async (id: string, data: UpdateTimeTableRequest) => {
    return apiClient.put(
      `${ENDPOINTS.TIME_TABLES.BASE}/${id}`,
      normalizeTimeTablePayload(data)
    );
  },

  deleteTimeTable: async (id: string) => {
    return apiClient.delete(`${ENDPOINTS.TIME_TABLES.BASE}/${id}`);
  },

  getReport: async (): Promise<TimeTableReport> => {
    return apiClient.get(ENDPOINTS.TIME_TABLES.REPORT);
  },
};
