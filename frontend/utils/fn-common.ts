import { jwtDecode } from "jwt-decode";

/**
 * Giải mã Token JWT để lấy thông tin bên trong.
 * @param token - Chuỗi JWT cần giải mã
 * @returns Đối tượng chứa thông tin đã giải mã hoặc null nếu lỗi
 */
export const decodeToken = <T>(token: string): T | null => {
  if (!token) return null;
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error("Lỗi khi giải mã Token:", error);
    return null;
  }
};

/**
 * Lấy ngày hết hạn của Token JWT.
 * @param token - Chuỗi JWT cần kiểm tra
 * @returns Đối tượng Date đại diện cho thời gian hết hạn hoặc null
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken<{ exp: number }>(token);
  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

/**
 * Kiểm tra xem Token JWT đã hết hạn hay chưa.
 * @param token - Chuỗi JWT cần kiểm tra
 * @returns true nếu token đã hết hạn, false nếu còn hạn
 */
export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiration(token);
  if (!expiry) return true;
  return expiry.getTime() < Date.now();
};

/**
 * Định dạng chuỗi ngày tháng sang dạng hh:mm:ss dd/mm/yyyy
 * @param dateString - Chuỗi ISO ngày tháng
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (
  dateString: string | Date | null | undefined
): string => {
  if (!dateString) return "--:--:-- --/--/----";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--:--:-- --/--/----";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};
