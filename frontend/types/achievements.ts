export interface Achievement {
  id: string;
  userId: string;
  semester?: string | null;
  schoolYear?: string | null;
  content?: string | null;
  year?: number | null;
  title?: string | null;
  description?: string | null;
  award?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    username: string;
    profile?: {
      code?: string | null;
      fullName?: string | null;
      unit?: string | null;
      class?: {
        className?: string | null;
      } | null;
      organization?: {
        organizationName?: string | null;
      } | null;
    } | null;
  } | null;
}

export interface AchievementQueryRequest extends QueryRequest {
  userId?: string;
  fullName?: string;
  unit?: string;
  semester?: string;
  schoolYear?: string;
  year?: number;
  award?: string;
}

export interface CreateAchievementRequest {
  userId: string;
  semester?: string | null;
  schoolYear?: string | null;
  content?: string | null;
  year?: number | null;
  title?: string | null;
  description?: string | null;
  award?: string | null;
}

export type UpdateAchievementRequest = CreateAchievementRequest;

export interface AchievementProfile {
  id: string;
  userId: string;
  totalYears?: number | null;
  totalAdvancedSoldier?: number | null;
  totalCompetitiveSoldier?: number | null;
  totalScientificTopics?: number | null;
  totalScientificInitiatives?: number | null;
  eligibleForMinistryReward?: boolean | null;
  eligibleForNationalReward?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScientificTopic {
  id: string;
  yearlyAchievementId: string;
  title?: string | null;
  description?: string | null;
  year?: number | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScientificInitiative {
  id: string;
  yearlyAchievementId: string;
  title?: string | null;
  description?: string | null;
  year?: number | null;
  status?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface YearlyAchievement {
  id: string;
  userId: string;
  year: number;
  decisionNumber?: string | null;
  decisionDate?: string | null;
  title?: string | null;
  hasMinistryReward?: boolean | null;
  hasNationalReward?: boolean | null;
  notes?: string | null;
  scientificTopics?: ScientificTopic[];
  scientificInitiatives?: ScientificInitiative[];
  ScientificTopics?: ScientificTopic[];
  ScientificInitiatives?: ScientificInitiative[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MyAchievementsResponse {
  achievements: Achievement[];
  profile?: AchievementProfile | null;
  yearlyAchievements: YearlyAchievement[];
}
