export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/profile",
    REGISTER: "/api/auth/register",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    CHANGE_PASSWORD: "/api/auth/change-password",
    NOTIFICATIONS: "/api/auth/notifications",
    NOTIFICATION_DETAIL: (id: string | number) =>
      `/api/auth/notifications/${id}`,
    MARK_NOTIFICATION_READ: (id: string | number) =>
      `/api/auth/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_READ: "/api/auth/notifications/read-all",
  },
  USERS: {
    BASE: "/api/users",
    DETAIL: (id: string | number) => `${ENDPOINTS.USERS.BASE}/${id}`,
    PROFILES: "/api/users/profiles",
    PROFILE_DETAIL: (id: string | number) =>
      `${ENDPOINTS.USERS.BASE}/profiles/${id}`,
    TOGGLE_ACTIVE: (id: string | number) =>
      `${ENDPOINTS.USERS.BASE}/${id}/toggle-active`,
    RESET_PASSWORD: (id: string | number) =>
      `${ENDPOINTS.USERS.BASE}/${id}/reset-password`,
    BATCH: "/api/users/batch",
    BATCH_PROFILES: "/api/users/batch-profiles",
    BATCH_GRADUATION: "/api/users/profiles/graduation/batch",
    IMPORT: "/api/users/import",
    IMPORT_TEMPLATE: "/api/users/import-template",
  },
  UNIVERSITIES: {
    BASE: "/api/universities",
  },
  ORGANIZATIONS: {
    BASE: "/api/organizations",
  },
  EDUCATION_LEVELS: {
    BASE: "/api/education-levels",
  },
  CLASSES: {
    BASE: "/api/classes",
    ASSIGN_STUDENTS_BATCH: (id: string | number) =>
      `/api/classes/${id}/students/batch`,
  },
  SEMESTERS: {
    BASE: "/api/semesters",
    SCHOOL_YEARS: "/api/semesters/school-years",
    TERMS: "/api/semesters/terms",
  },
  TIME_TABLES: {
    BASE: "/api/time-tables",
    BATCH: "/api/time-tables/batch",
    REPORT: "/api/time-tables/report",
    TIME_TABLE: "/api/users/time-table",
  },
  TUITION_FEES: {
    BASE: "/api/tuition-fees",
    BATCH: "/api/tuition-fees/batch",
    IMPORT: "/api/tuition-fees/import",
    TEMPLATE: "/api/tuition-fees/template",
    MY: "/api/users/tuition-fees",
  },
  CUT_RICE: {
    BASE: "/api/cut-rice",
    MY: "/api/users/cut-rice",
    EXPORT: "/api/cut-rice/export",
    GENERATE: (userId: string | number) =>
      `/api/users/cut-rice/generate/${userId}`,
    GENERATE_ALL: "/api/users/cut-rice/generate-all",
  },
  DUTY_SCHEDULES: {
    BASE: "/api/commander-duty-schedules",
  },
  ACADEMIC_RESULTS: {
    BASE: "/api/users/academic-results",
  },
  ACHIEVEMENTS: {
    BASE: "/api/achievements",
    BATCH: "/api/achievements/batch",
    MY: "/api/users/achievements",
  },
  YEARLY_ACHIEVEMENTS: {
    BASE: "/api/yearly-achievements",
    FULL: "/api/yearly-achievements/full",
  },
  SCIENTIFIC_TOPICS: {
    BASE: "/api/scientific-topics",
  },
  SCIENTIFIC_INITIATIVES: {
    BASE: "/api/scientific-initiatives",
  },
  GRADE_REQUESTS: {
    STUDENT_BASE: "/api/students/grade-requests",
    STUDENT_DETAIL: (id: string | number) =>
      `/api/students/grade-requests/${id}`,
    COMMANDER_BASE: "/api/commanders/grade-requests",
    COMMANDER_DETAIL: (id: string | number) =>
      `/api/commanders/grade-requests/${id}`,
    APPROVE: (id: string | number) =>
      `/api/commanders/grade-requests/${id}/approve`,
    REJECT: (id: string | number) =>
      `/api/commanders/grade-requests/${id}/reject`,
  },
  REPORTS: {
    TUITION: "/api/commanders/reports/tuition",
  },
} as const;
