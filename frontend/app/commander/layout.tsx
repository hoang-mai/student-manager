import React from "react";
import Sidebar from "@/components/commander/layout/Sidebar";
import Header from "@/components/commander/layout/Header";

export default function CommanderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden text-neutral-900 ">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Vùng nội dung chính */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header trên cùng */}
        <Header />

        {/* Nội dung trang */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
