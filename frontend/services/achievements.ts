import { ENDPOINTS } from "@/constants/endpoints";
import {
  Achievement,
  AchievementQueryRequest,
  CreateAchievementRequest,
  MyAchievementsResponse,
  UpdateAchievementRequest,
} from "@/types/achievements";
import apiClient from "./axios-client";

export const achievementService = {
  getAchievements: async (
    params?: AchievementQueryRequest
  ): Promise<PaginatedResponse<Achievement>> => {
    return apiClient.get(ENDPOINTS.ACHIEVEMENTS.BASE, { params });
  },

  createAchievement: async (data: CreateAchievementRequest) => {
    return apiClient.post(ENDPOINTS.ACHIEVEMENTS.BASE, data);
  },

  updateAchievement: async (id: string, data: UpdateAchievementRequest) => {
    return apiClient.put(`${ENDPOINTS.ACHIEVEMENTS.BASE}/${id}`, data);
  },

  deleteAchievement: async (id: string) => {
    return apiClient.delete(`${ENDPOINTS.ACHIEVEMENTS.BASE}/${id}`);
  },

  getMyAchievements: async (): Promise<ApiResponse<MyAchievementsResponse>> => {
    return apiClient.get(ENDPOINTS.ACHIEVEMENTS.MY);
  },
};
