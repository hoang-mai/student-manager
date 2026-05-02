"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_MENU, MenuItem } from "@/constants/admin-menu";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="relative flex flex-col w-70 bg-white/70 backdrop-blur-xl border-r border-neutral-100/50 shadow-sm z-50 overflow-hidden">
      {/* Background blobs for flair */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-secondary-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Sidebar */}
      <div className="relative flex items-center gap-3 p-6 h-20">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-primary-600/20">
          A
        </div>
        <div className="flex flex-col">
          <span className="font-black text-neutral-800 whitespace-nowrap uppercase tracking-tighter text-lg leading-tight">
            Vanguard
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold leading-none">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Danh sách Menu */}
      <nav className="relative flex-1 overflow-y-auto py-4 px-4 no-scrollbar">
        <ul className="space-y-1.5">
          {ADMIN_MENU.map((item: MenuItem) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/admin" && pathname.startsWith(item.path));

            return (
              <li key={item.code}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-primary-600 text-white shadow-md shadow-primary-600/10"
                      : "text-neutral-500 hover:bg-white hover:text-primary-700 hover:shadow-sm"
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-neutral-400 group-hover:text-primary-600"}`}
                  />

                  <span className="whitespace-nowrap overflow-hidden text-sm font-semibold tracking-tight">
                    {item.title}
                  </span>

                  {/* Hover/Active Effect Layer */}
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
