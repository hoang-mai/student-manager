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
}

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
