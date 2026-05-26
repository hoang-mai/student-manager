import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";
import {
  CreateTimeTableRequest,
  TimeTable,
  TimeTableQueryRequest,
  TimeTableReport,
  UpdateTimeTableRequest,
} from "@/types/time-tables";

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
    return apiClient.post(ENDPOINTS.TIME_TABLES.BASE, data);
  },

  updateTimeTable: async (id: string, data: UpdateTimeTableRequest) => {
    return apiClient.put(`${ENDPOINTS.TIME_TABLES.BASE}/${id}`, data);
  },

  deleteTimeTable: async (id: string) => {
    return apiClient.delete(`${ENDPOINTS.TIME_TABLES.BASE}/${id}`);
  },

  getReport: async (): Promise<TimeTableReport> => {
    return apiClient.get(ENDPOINTS.TIME_TABLES.REPORT);
  },
};
