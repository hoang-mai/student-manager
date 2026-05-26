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
    TOGGLE_ACTIVE: (id: string | number) =>
      `${ENDPOINTS.USERS.BASE}/${id}/toggle-active`,
    RESET_PASSWORD: (id: string | number) =>
      `${ENDPOINTS.USERS.BASE}/${id}/reset-password`,
    BATCH: "/api/users/batch",
    BATCH_PROFILES: "/api/users/batch-profiles",
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
  },
  SEMESTERS: {
    BASE: "/api/semesters",
  },
  TIME_TABLES: {
    BASE: "/api/time-tables",
    REPORT: "/api/time-tables/report",
    TIME_TABLE: "/api/users/time-table",
  },
  TUITION_FEES: {
    BASE: "/api/tuition-fees",
    MY: "/api/users/tuition-fees",
  },
  CUT_RICE: {
    BASE: "/api/cut-rice",
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
    MY: "/api/users/achievements",
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
