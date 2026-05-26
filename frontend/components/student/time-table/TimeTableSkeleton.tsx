import Skeleton from "@/library/Skeleton";

export default function TimeTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Skeleton variant="rounded" width={100} height={28} />
        <Skeleton variant="rounded" width={90} height={28} />
        <Skeleton variant="rounded" width={90} height={28} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="min-h-44 rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm dark:border-neutral-700/80 dark:bg-neutral-900"
          >
            <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-700/80">
              <Skeleton variant="text" width={60} height={16} />
              <Skeleton variant="rounded" width={50} height={22} />
            </div>
            <div className="space-y-3">
              {Array.from({ length: i % 3 === 0 ? 0 : i % 2 === 0 ? 2 : 1 }).map((_, j) => (
                <div key={j} className="rounded-2xl border border-neutral-100 p-3 dark:border-neutral-700/50">
                  <Skeleton variant="text" width={120} height={14} />
                  <div className="mt-2 flex gap-2">
                    <Skeleton variant="rounded" width={80} height={22} />
                    <Skeleton variant="rounded" width={70} height={22} />
                  </div>
                </div>
              ))}
              {i % 3 === 0 && (
                <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700">
                  <Skeleton variant="text" width={100} height={12} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
