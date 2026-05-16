export interface DutySchedule {
  id: string;
  fullName: string;
  rank: string;
  phoneNumber: string;
  position: string;
  workDay: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDutyScheduleRequest {
  fullName: string;
  rank: string;
  phoneNumber: string;
  position: string;
  workDay: string;
}

export interface UpdateDutyScheduleRequest {
  fullName: string;
  rank: string;
  phoneNumber: string;
  position: string;
  workDay: string;
}

export interface DutyScheduleQueryRequest {
  page?: number;
  limit?: number;
  fullName?: string;
  position?: string;
  rank?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}