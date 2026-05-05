export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/profile",
    REGISTER: "/api/auth/register",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },
  USERS: {
    BASE: "/api/users",
    DETAIL: (id: string | number) => `${ENDPOINTS.USERS.BASE}/${id}`,
    TOGGLE_ACTIVE: (id: string | number) => `${ENDPOINTS.USERS.BASE}/${id}/toggle-active`,
    RESET_PASSWORD: (id: string | number) => `${ENDPOINTS.USERS.BASE}/${id}/reset-password`,
    BATCH: "/api/users/batch",
  },
  TRAINING_UNITS: {
    UNIVERSITIES: "/api/universities",
    UNIVERSITY_HIERARCHY: "/api/universities/hierarchy",
    ORGANIZATIONS: "/api/organizations",
    EDUCATION_LEVELS: "/api/education-levels",
    CLASSES: "/api/classes",
  },
};
