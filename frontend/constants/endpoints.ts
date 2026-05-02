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
  },
};
