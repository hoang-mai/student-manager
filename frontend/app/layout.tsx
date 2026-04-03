import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hệ thống quản lý học viên",
  description: "Hệ thống quản lý học viên là một ứng dụng web được thiết kế để giúp các tổ chức giáo dục quản lý thông tin học viên một cách hiệu quả. Hệ thống này cung cấp các tính năng như đăng ký học viên, quản lý khóa học, theo dõi tiến độ học tập và tạo báo cáo chi tiết về hoạt động của học viên. Với giao diện thân thiện và dễ sử dụng, hệ thống quản lý học viên giúp cải thiện trải nghiệm học tập và tăng cường sự tương tác giữa giáo viên và học viên.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
