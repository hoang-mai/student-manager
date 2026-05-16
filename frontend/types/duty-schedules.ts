export interface DutySchedule {
  id: string;
  userId: string;
  fullName: string;
  rank: string;
  phoneNumber: string;
  position: string;
  workDay: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDutyScheduleRequest {
  userId: string;
  position: string;
  workDay: string;
}

export interface UpdateDutyScheduleRequest {
  userId?: string;
  position: string;
  workDay: string;
}

export interface DutyScheduleQueryRequest {
  page?: number;
  limit?: number;
  fullName?: string;
  position?: string;
  rank?: string;
  userId?: string;
  fetchAll?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
