export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectName?: string | null;
  week?: string | null;
}

export interface TimeTableProfile {
  id?: string;
  avatar?: string;
  fullName?: string;
  code?: string;
  unit?: string;
}

export interface TimeTableUser {
  id: string;
  username?: string;
  role?: string;
  profile?: TimeTableProfile;
}

export interface TimeTable {
  id: string;
  userId: string;
  schedules: ScheduleItem[] | null;
  scheduleCount?: number;
  subjectNames?: string[];
  weeks?: string[];
  rooms?: string[];
  user?: TimeTableUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeTableRequest {
  userId: string;
  schedules?: ScheduleItem[] | null;
}

export interface UpdateTimeTableRequest {
  userId?: string;
  schedules?: ScheduleItem[] | null;
}

export interface TimeTableQueryRequest extends QueryRequest {
  userId?: string;
  fullName?: string;
}

export interface TimeTableReportRow {
  unit: string;
  fullName: string;
  scheduleCount: number;
  subjectName: string;
  room: string;
  week: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface TimeTableReport {
  summary: {
    totalStudents: number;
    totalSchedules: number;
    totalSubjects: number;
    totalWeeks: number;
  };
  data: TimeTableReportRow[];
}
