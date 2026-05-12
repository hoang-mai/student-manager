import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import Link from "next/link";
import { HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi";

export default function ClassSkeleton() {
  const columnCount = 9; // STT + Tên lớp + Số học viên + Ngày tạo + Ngày cập nhật + Hành động

  return (
    <div className="space-y-8 rounded-2xl bg-white p-6 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-neutral-400">
        <Link href="/commander" className="flex items-center gap-2">
          <HiOutlineHome size={14} />
          <Typography variant="label" tracking="wide">Tổng quan</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">Quản lý lớp học</Typography>
      </div>

      {/* Header */}
      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <Typography variant="h1" transform="uppercase">Quản lý lớp học</Typography>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white overflow-hidden relative">
        <div className="px-4">
          <div className="space-y-4">
            {/* Toolbar skeleton */}
            <div className="flex flex-row items-center justify-end gap-2 mb-4 px-2">
              <Skeleton width={100} height={36} />
              <Skeleton width={120} height={36} />
            </div>

            {/* Table */}
            <div className="w-full rounded-2xl border border-neutral-100 overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  {/* Header */}
                  <thead className="bg-neutral-50/50">
                    <tr>
                      {Array.from({ length: columnCount }).map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <Skeleton variant="text" width={i === 0 ? 30 : 80} height={14} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {/* Rows */}
                  <tbody>
                    {Array.from({ length: 10 }).map((_, rowIdx) => (
                      <tr key={rowIdx} className="border-t border-neutral-50">
                        {/* STT */}
                        <td className="px-4 py-3"><Skeleton variant="text" width={20} height={14} /></td>
                        {/* Tên lớp */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Skeleton variant="rounded" width={32} height={32} />
                            <Skeleton variant="text" width={120} height={14} />
                          </div>
                        </td>
                        {/* Số học viên */}
                        <td className="px-4 py-3"><Skeleton variant="text" width={40} height={14} /></td>
                        {/* Ngày tạo */}
                        <td className="px-4 py-3"><Skeleton variant="text" width={110} height={14} /></td>
                        {/* Ngày cập nhật */}
                        <td className="px-4 py-3"><Skeleton variant="text" width={110} height={14} /></td>
                        {/* Hành động */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Skeleton variant="rounded" width={36} height={36} />
                            <Skeleton variant="rounded" width={36} height={36} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination skeleton */}
              <div className="border-t border-neutral-100 px-4 py-3 flex items-center justify-between">
                <Skeleton variant="text" width={120} height={14} />
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" width={32} height={32} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
