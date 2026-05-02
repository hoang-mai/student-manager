/**
 * Các hằng số dùng chung cho toàn bộ ứng dụng
 */

export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
};

export const JWT_CONFIG = {
  DEFAULT_EXPIRED_DATE: 7,
};

export const PROTECTED_ROUTES = ["/student", "/commander", "/admin"];
export const AUTH_ROUTES = ["/login", "/register"];

export const ROLES = {
  ADMIN: { id: 1, name: "Admin", role: "ADMIN", path: "/admin" },
  COMMANDER: { id: 2, name: "Chỉ huy", role: "COMMANDER", path: "/commander" },
  STUDENT: { id: 3, name: "Học viên", role: "STUDENT", path: "/student" },
};

export const THEMES = {
  DEFAULT_THEME: "light",
  LIGHT: "light",
  DARK: "dark",
};

export const DEFAULT_VALUES = {
  DEFAULT_ADMIN_NAME: "Admin",
  DEFAULT_COMMANDER_NAME: "Chỉ huy đơn vị",
  DEFAULT_STUDENT_NAME: "Học viên",
};

export const DEFAULT_PAGE = {
  PAGE_INDEX: 0,
  PAGE_SIZE: 10,
};