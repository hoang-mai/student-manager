/**
 * Cơ sở đào tạo (Trường đại học)
 */
export interface University {
  id: string;
  universityCode: string;
  universityName: string;
  totalStudents: number;
  status: "ACTIVE" | "INACTIVE";
}

/**
 * Tham số truy vấn cơ sở đào tạo
 */
export interface UniversityQueryRequest {
  page?: number;
  limit?: number;
  universityCode?: string;
  universityName?: string;
  status?: "ACTIVE" | "INACTIVE";
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Request tạo trường đại học
 */
export interface CreateUniversityRequest {
  universityCode: string;
  universityName: string;
}

/**
 * Request cập nhật trường đại học
 */
export interface UpdateUniversityRequest {
  universityCode?: string;
  universityName?: string;
  status?: "ACTIVE" | "INACTIVE";
}
