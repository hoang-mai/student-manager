"use client";

import { useMemo } from "react";
import type { IconType } from "react-icons";
import {
  HiOutlineAcademicCap,
  HiOutlineBadgeCheck,
  HiOutlineCalendar,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiOutlineFlag,
  HiOutlineSparkles,
} from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import Badge, { BadgeVariant } from "@/library/Badge";
import PageContainer from "@/library/PageContainer";
import Typography from "@/library/Typography";
import { QUERY_KEYS } from "@/constants/query-keys";
import { achievementService } from "@/services/achievements";
import {
  Achievement,
  AchievementProfile,
  ScientificInitiative,
  ScientificTopic,
  YearlyAchievement,
} from "@/types/achievements";
import { formatDate, textOrDash } from "@/utils/fn-common";
import AchievementsSkeleton from "./AchievementsSkeleton";

type SummaryTone = "primary" | "secondary" | "success" | "warning" | "sky" | "neutral";
type ScienceRecord = ScientificTopic | ScientificInitiative;

const toneStyles: Record<SummaryTone, string> = {
  primary: "border-primary-100 bg-primary-50 text-primary-700 dark:border-primary-700/60 dark:bg-primary-950/40 dark:text-primary-100",
  secondary: "border-secondary-100 bg-secondary-50 text-secondary-700 dark:border-secondary-700/60 dark:bg-secondary-950/40 dark:text-secondary-100",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-100",
  warning: "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-100",
  sky: "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-700/60 dark:bg-sky-950/40 dark:text-sky-100",
  neutral: "border-neutral-100 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
};

const formatNumber = (value?: number | null) => (value ?? 0).toLocaleString("vi-VN");

const getTopics = (yearlyAchievement: YearlyAchievement) =>
  yearlyAchievement.scientificTopics || yearlyAchievement.ScientificTopics || [];

const getInitiatives = (yearlyAchievement: YearlyAchievement) =>
  yearlyAchievement.scientificInitiatives ||
  yearlyAchievement.ScientificInitiatives ||
  [];

const getStatusVariant = (status?: string | null): BadgeVariant => {
  const normalized = status?.toLowerCase() || "";

  if (
    normalized.includes("hoàn") ||
    normalized.includes("đạt") ||
    normalized.includes("duyệt") ||
    normalized.includes("approved") ||
    normalized.includes("done") ||
    normalized.includes("complete")
  ) {
    return "success";
  }

  if (
    normalized.includes("đang") ||
    normalized.includes("chờ") ||
    normalized.includes("pending") ||
    normalized.includes("progress")
  ) {
    return "warning";
  }

  return "neutral";
};

export default function Main() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ACHIEVEMENTS],
    queryFn: achievementService.getMyAchievements,
  });

  const payload = data?.data;
  const achievements = useMemo(
    () => payload?.achievements || [],
    [payload?.achievements]
  );
  const profile = payload?.profile || null;
  const yearlyAchievements = useMemo(
    () => payload?.yearlyAchievements || [],
    [payload?.yearlyAchievements]
  );

  const summary = useMemo(() => {
    const allYears = new Set<number>();

    achievements.forEach((achievement) => {
      if (achievement.year) allYears.add(achievement.year);
    });

    yearlyAchievements.forEach((achievement) => {
      if (achievement.year) allYears.add(achievement.year);
    });

    const topicCount = yearlyAchievements.reduce(
      (total, item) => total + getTopics(item).length,
      0
    );
    const initiativeCount = yearlyAchievements.reduce(
      (total, item) => total + getInitiatives(item).length,
      0
    );

    return {
      totalYears: profile?.totalYears ?? allYears.size,
      totalAchievements: achievements.length,
      totalAdvancedSoldier: profile?.totalAdvancedSoldier ?? 0,
      totalCompetitiveSoldier: profile?.totalCompetitiveSoldier ?? 0,
      totalScientificTopics: profile?.totalScientificTopics ?? topicCount,
      totalScientificInitiatives:
        profile?.totalScientificInitiatives ?? initiativeCount,
    };
  }, [achievements, profile, yearlyAchievements]);

  const summaryCards = [
    {
      label: "Năm ghi nhận",
      value: formatNumber(summary.totalYears),
      helper: "Năm có thành tích",
      icon: HiOutlineCalendar,
      tone: "primary",
    },
    {
      label: "Khen thưởng",
      value: formatNumber(summary.totalAchievements),
      helper: "Thành tích đã lưu",
      icon: HiOutlineBadgeCheck,
      tone: "success",
    },
    {
      label: "Chiến sĩ tiên tiến",
      value: formatNumber(summary.totalAdvancedSoldier),
      helper: "Số lần được ghi nhận",
      icon: HiOutlineFlag,
      tone: "secondary",
    },
    {
      label: "Chiến sĩ thi đua",
      value: formatNumber(summary.totalCompetitiveSoldier),
      helper: "Số lần được ghi nhận",
      icon: HiOutlineSparkles,
      tone: "warning",
    },
    {
      label: "Đề tài khoa học",
      value: formatNumber(summary.totalScientificTopics),
      helper: "Đề tài đã tham gia",
      icon: HiOutlineAcademicCap,
      tone: "sky",
    },
    {
      label: "Sáng kiến",
      value: formatNumber(summary.totalScientificInitiatives),
      helper: "Sáng kiến đã ghi nhận",
      icon: HiOutlineDocumentText,
      tone: "neutral",
    },
  ] satisfies Array<{
    label: string;
    value: string;
    helper: string;
    icon: IconType;
    tone: SummaryTone;
  }>;

  return (
    <PageContainer
      breadcrumb={[
        { label: "Trang chủ", href: "/student" },
        { label: "Thành tích" },
      ]}
      title="Thành tích"
      subtitle="Theo dõi khen thưởng, thành tích theo năm học, đề tài khoa học và sáng kiến cá nhân."
      isLoading={isLoading}
      skeleton={<AchievementsSkeleton />}
      isError={isError}
      errorMessage={error?.message}
      onRetry={refetch}
      className="space-y-8"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>

        <RewardEligibility profile={profile} />

        <section className="space-y-4">
          <SectionHeader
            title="Khen thưởng"
            description="Các thành tích học tập, rèn luyện và giải thưởng đã được ghi nhận."
            count={achievements.length}
          />

          {achievements.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HiOutlineBadgeCheck}
              title="Chưa có khen thưởng"
              description="Các thành tích được phê duyệt sẽ hiển thị tại đây."
            />
          )}
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Thành tích theo năm"
            description="Tổng hợp quyết định, danh hiệu và hoạt động nghiên cứu theo từng năm."
            count={yearlyAchievements.length}
          />

          {yearlyAchievements.length ? (
            <div className="space-y-4">
              {yearlyAchievements.map((achievement) => (
                <YearlyAchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={HiOutlineCollection}
              title="Chưa có thành tích theo năm"
              description="Dữ liệu tổng hợp theo năm sẽ được cập nhật khi có quyết định mới."
            />
          )}
        </section>
      </div>
    </PageContainer>
  );
}

const SummaryCard = ({
  label,
  value,
  helper,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  helper: string;
  icon: IconType;
  tone: SummaryTone;
}) => (
  <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
    <div className="flex size-10 items-center justify-center rounded-xl bg-white/70 text-current shadow-sm dark:bg-white/10 dark:shadow-none">
      <Icon size={20} />
    </div>
    <p className="mt-4 text-xs font-black uppercase opacity-75">{label}</p>
    <p className="mt-2 text-3xl font-black leading-none">{value}</p>
    <p className="mt-2 text-xs font-semibold opacity-70">{helper}</p>
  </div>
);

const RewardEligibility = ({
  profile,
}: {
  profile: AchievementProfile | null;
}) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <EligibilityCard
      title="Đề nghị khen thưởng cấp Bộ"
      description="Trạng thái xét điều kiện dựa trên hồ sơ thành tích hiện có."
      eligible={Boolean(profile?.eligibleForMinistryReward)}
    />
    <EligibilityCard
      title="Đề nghị khen thưởng cấp Nhà nước"
      description="Trạng thái xét điều kiện dựa trên hồ sơ thành tích hiện có."
      eligible={Boolean(profile?.eligibleForNationalReward)}
    />
  </div>
);

const EligibilityCard = ({
  title,
  description,
  eligible,
}: {
  title: string;
  description: string;
  eligible: boolean;
}) => (
  <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Typography variant="body" weight="black" className="text-neutral-900 dark:text-neutral-100">
          {title}
        </Typography>
        <Typography variant="caption" className="mt-1 text-neutral-500 dark:text-neutral-400">
          {description}
        </Typography>
      </div>
      <Badge variant={eligible ? "success" : "neutral"} className="shrink-0">
        {eligible ? "Đủ điều kiện" : "Chưa đủ điều kiện"}
      </Badge>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  description,
  count,
}: {
  title: string;
  description: string;
  count: number;
}) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <Typography variant="h3" weight="black" transform="uppercase">
        {title}
      </Typography>
      <Typography variant="body" className="mt-1 text-neutral-500 dark:text-neutral-400">
        {description}
      </Typography>
    </div>
    <Badge variant="primary" className="w-fit">
      {count.toLocaleString("vi-VN")} mục
    </Badge>
  </div>
);

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
  const description = achievement.description || achievement.content;

  return (
    <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-colors hover:border-primary-100 hover:bg-primary-50/30 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none dark:hover:border-primary-700/60 dark:hover:bg-primary-950/20">
      <div className="flex gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-200">
          <HiOutlineBadgeCheck size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <Typography variant="body" weight="black" className="text-neutral-900 dark:text-neutral-100">
            {textOrDash(achievement.title)}
          </Typography>

          <div className="mt-3 flex flex-wrap gap-2">
            {achievement.award && <Badge variant="success">{achievement.award}</Badge>}
            {achievement.year && <Badge variant="primary">{achievement.year}</Badge>}
            {achievement.schoolYear && (
              <Badge variant="secondary">{achievement.schoolYear}</Badge>
            )}
            {achievement.semester && (
              <Badge variant="neutral">Học kỳ {achievement.semester}</Badge>
            )}
          </div>
        </div>
      </div>

      <Typography variant="body" className="mt-4 text-neutral-600 dark:text-neutral-300">
        {description || "Chưa có mô tả chi tiết."}
      </Typography>
    </article>
  );
};

const YearlyAchievementCard = ({
  achievement,
}: {
  achievement: YearlyAchievement;
}) => {
  const topics = getTopics(achievement);
  const initiatives = getInitiatives(achievement);
  const hasScienceRecords = topics.length > 0 || initiatives.length > 0;

  return (
    <article className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-none">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700 dark:bg-secondary-500/10 dark:text-secondary-100">
            <HiOutlineCalendar size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{achievement.year}</Badge>
              {achievement.hasMinistryReward && (
                <Badge variant="success">Khen thưởng cấp Bộ</Badge>
              )}
              {achievement.hasNationalReward && (
                <Badge variant="success">Khen thưởng cấp Nhà nước</Badge>
              )}
            </div>
            <Typography variant="h3" weight="black" className="mt-3 text-neutral-900 dark:text-neutral-100">
              {textOrDash(achievement.title)}
            </Typography>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Badge variant="primary">{topics.length} đề tài</Badge>
          <Badge variant="secondary">{initiatives.length} sáng kiến</Badge>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-5 dark:border-neutral-800 md:grid-cols-2">
        <InfoLine
          icon={HiOutlineClipboardList}
          label="Số quyết định"
          value={achievement.decisionNumber}
        />
        <InfoLine
          icon={HiOutlineCalendar}
          label="Ngày quyết định"
          value={formatDate(achievement.decisionDate)}
        />
      </div>

      {achievement.notes && (
        <Typography variant="body" className="mt-4 text-neutral-600 dark:text-neutral-300">
          {achievement.notes}
        </Typography>
      )}

      {hasScienceRecords && (
        <div className="mt-5 grid grid-cols-1 gap-5 border-t border-neutral-100 pt-5 dark:border-neutral-800 lg:grid-cols-2">
          <ScienceList
            title="Đề tài khoa học"
            icon={HiOutlineAcademicCap}
            items={topics}
          />
          <ScienceList
            title="Sáng kiến"
            icon={HiOutlineDocumentText}
            items={initiatives}
          />
        </div>
      )}
    </article>
  );
};

const InfoLine = ({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-300">
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <Typography variant="label" color="gray">
        {label}
      </Typography>
      <Typography variant="body" weight="semibold" className="text-neutral-800 dark:text-neutral-100">
        {textOrDash(value)}
      </Typography>
    </div>
  </div>
);

const ScienceList = ({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: IconType;
  items: ScienceRecord[];
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-neutral-800 dark:text-neutral-100">
      <Icon size={18} />
      <Typography variant="body" weight="black">
        {title}
      </Typography>
    </div>

    {items.length ? (
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-l-2 border-primary-200 py-1 pl-3 dark:border-primary-700"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Typography variant="body" weight="semibold" className="text-neutral-800 dark:text-neutral-100">
                {textOrDash(item.title)}
              </Typography>
              {item.status && (
                <Badge variant={getStatusVariant(item.status)} className="w-fit">
                  {item.status}
                </Badge>
              )}
            </div>
            {item.description && (
              <Typography variant="caption" className="mt-1 text-neutral-500 dark:text-neutral-400">
                {item.description}
              </Typography>
            )}
            {item.year && (
              <Typography variant="caption" className="mt-1 text-neutral-400 dark:text-neutral-500">
                Năm {item.year}
              </Typography>
            )}
          </div>
        ))}
      </div>
    ) : (
      <Typography variant="caption" className="text-neutral-400 dark:text-neutral-500">
        Chưa có dữ liệu.
      </Typography>
    )}
  </div>
);

const EmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: IconType;
  title: string;
  description: string;
}) => (
  <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/70 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/60">
    <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-neutral-400 shadow-sm dark:bg-neutral-950 dark:text-neutral-500 dark:shadow-none">
      <Icon size={28} />
    </div>
    <Typography variant="body" weight="black" className="mt-4 text-neutral-800 dark:text-neutral-100">
      {title}
    </Typography>
    <Typography variant="body" className="mt-1 max-w-md text-neutral-500 dark:text-neutral-400">
      {description}
    </Typography>
  </div>
);
