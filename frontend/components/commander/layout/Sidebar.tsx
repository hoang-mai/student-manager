"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMMANDER_MENU, MenuItem } from "@/constants/commander-menu";
import Typography from "@/library/Typography";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="relative flex flex-col w-[280px] bg-white/70 backdrop-blur-xl border-r border-neutral-100/50 shadow-sm z-50 overflow-hidden">
      {/* Background blobs for flair */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-64 h-64 bg-secondary-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Sidebar */}
      <div className="relative flex items-center gap-3 p-6 h-20">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            style={{ height: "auto" }}
          />
        </div>
        <Typography variant="h2" weight="black" className="leading-none">
          Tiên Phong
        </Typography>
      </div>

      {/* Danh sách Menu */}
      <nav className="relative flex-1 overflow-y-auto py-4 px-4 no-scrollbar">
        <ul className="space-y-1.5">
          {COMMANDER_MENU.map((item: MenuItem) => {
            const isActive =
              pathname === item.path ||
              (item.path !== "/commander" && pathname.startsWith(item.path));

            return (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
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
