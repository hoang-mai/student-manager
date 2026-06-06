export interface Semester {
  id: string;
  code: string;
  schoolYearId?: string | null;
  schoolYear: string;
  schoolYearInfo?: SchoolYear | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolYear {
  id: string;
  schoolYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemesterRequest {
  code: string;
  schoolYearId?: string | null;
  schoolYear: string;
}

export interface CreateSchoolYearRequest {
  schoolYear: string;
}

export interface CreateTermRequest {
  schoolYearId?: string | null;
  schoolYear?: string;
  term: 1 | 2 | 3;
}

export interface UpdateSemesterRequest {
  code?: string;
  schoolYearId?: string | null;
  schoolYear?: string;
}

export interface SemesterQueryRequest extends QueryRequest {
  code?: string;
  schoolYearId?: string;
  schoolYear?: string;
}
