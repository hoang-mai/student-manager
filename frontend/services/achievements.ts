import { ENDPOINTS } from "@/constants/endpoints";
import { MyAchievementsResponse } from "@/types/achievements";
import apiClient from "./axios-client";

export const achievementService = {
  getMyAchievements: async (): Promise<ApiResponse<MyAchievementsResponse>> => {
    return apiClient.get(ENDPOINTS.ACHIEVEMENTS.MY);
  },
};
