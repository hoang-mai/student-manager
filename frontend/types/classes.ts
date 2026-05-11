export interface Class {
  id: string;
  className: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  className: string;
  studentCount: number;
  educationLevelId: string;
}

export interface UpdateClassRequest {
  className?: string;
  studentCount?: number;
  educationLevelId?: string;
}

export interface ClassQueryRequest {
  page?: number;
  limit?: number;
  educationLevelId?: string;
  className?: string;
}
