import Skeleton from "@/library/Skeleton";
import Typography from "@/library/Typography";
import Button from "@/library/Button";
import Link from "next/link";
import { HiOutlineHome, HiOutlineChevronRight, HiOutlinePlus } from "react-icons/hi";

export default function UniversitySkeleton() {
  return (
    <div className="space-y-8 relative rounded-2xl bg-white p-6 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-neutral-400">
        <Link href="/commander" className="flex items-center gap-2">
          <HiOutlineHome size={14} />
          <Typography variant="label" tracking="wide">Tổng quan</Typography>
        </Link>
        <HiOutlineChevronRight size={12} />
        <Typography variant="label" color="primary" tracking="wide">Cơ sở đào tạo</Typography>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Typography variant="h1" transform="uppercase">Quản lý cơ sở đào tạo</Typography>
        <Button disabled className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-primary-600 rounded-xl text-[11px]! font-black! uppercase tracking-wider text-white opacity-50 cursor-not-allowed h-auto" icon={HiOutlinePlus}>
          Thêm trường đại học
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={48} height={48} />
                  <div className="space-y-2">
                    <Skeleton variant="text" width={200} height={24} />
                    <Skeleton variant="text" width={150} height={16} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
