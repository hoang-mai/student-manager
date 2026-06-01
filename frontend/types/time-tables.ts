export interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  subjectName?: string | null;
  week?: number | null;
}

export interface ScheduleFormItem {
  day: string;
  timeRange: {
    startTime: string;
    endTime: string;
  };
  room: string;
  subjectName?: string | null;
  week?: number | null;
}

export type ScheduleInput = ScheduleItem | ScheduleFormItem;

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
  semesterId?: string | null;
  schedules: ScheduleItem[] | null;
  scheduleCount?: number;
  subjectNames?: string[];
  weeks?: Array<number | string>;
  rooms?: string[];
  user?: TimeTableUser;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimeTableRequest {
  userId: string;
  semesterId?: string | null;
  schedules?: ScheduleInput[] | null;
}

export interface UpdateTimeTableRequest {
  userId?: string;
  semesterId?: string | null;
  schedules?: ScheduleInput[] | null;
}

export interface BatchTimeTableItem {
  studentCode: string;
  semesterId?: string | null;
  schedules: ScheduleItem[];
}

export interface BatchTimeTableRequest {
  semesterId?: string | null;
  items: BatchTimeTableItem[];
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
  week: number | string;
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
