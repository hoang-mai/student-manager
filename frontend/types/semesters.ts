export interface Semester {
  id: string;
  code: string;
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemesterRequest {
  code: string;
  schoolYear: string;
}

export interface UpdateSemesterRequest {
  code?: string;
  schoolYear?: string;
}

export interface SemesterQueryRequest extends QueryRequest {
  code?: string;
  schoolYear?: string;
}
