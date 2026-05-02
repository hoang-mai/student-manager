import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES, ROLES } from "./constants/constants";

export default function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("role")?.value as keyof typeof ROLES | undefined;
  const { pathname } = request.nextUrl;


  // 1. Nếu người dùng cố gắng vào trang bảo vệ mà KHÔNG có refreshToken
  if (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    (!refreshToken || !role || !ROLES[role])
  ) {
    const url = new URL("/login", request.url);
    // Lưu lại trang đang định vào để sau khi login xong có thể quay lại (optional)
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Nếu ĐÃ có refreshToken
  if (refreshToken && role && ROLES[role]) {
    const userPath = ROLES[role].path;

    // A. Cố vào trang login/register -> Chuyển về Dashboard của role đó
    if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL(userPath, request.url));
    }

    // B. Kiểm tra phân quyền truy cập chéo (RBAC)
    // Chặn Student/Commander vào /admin
    if (pathname.startsWith(ROLES.ADMIN.path) && role !== ROLES.ADMIN.role) {
      return NextResponse.redirect(new URL(userPath, request.url));
    }

    // Chặn Student/Admin vào /commander
    if (pathname.startsWith(ROLES.COMMANDER.path) && role !== ROLES.COMMANDER.role) {
      return NextResponse.redirect(new URL(userPath, request.url));
    }

    // Chặn Admin/Commander vào /student
    if (pathname.startsWith(ROLES.STUDENT.path) && role !== ROLES.STUDENT.role) {
      return NextResponse.redirect(new URL(userPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)",
  ],
};
