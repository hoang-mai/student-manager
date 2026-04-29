import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./constants/constants";

export default function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu người dùng cố gắng vào trang bảo vệ mà KHÔNG có refreshToken
  if (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) &&
    !refreshToken
  ) {
    const url = new URL("/login", request.url);
    // Lưu lại trang đang định vào để sau khi login xong có thể quay lại (optional)
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Nếu người dùng ĐÃ có refreshToken mà vẫn cố vào trang login/register
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)",
  ],
};
