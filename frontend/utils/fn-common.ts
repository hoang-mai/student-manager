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
