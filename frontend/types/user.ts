
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  isActive: boolean;
  role: "ADMIN" | "COMMANDER" | "STUDENT";
  refreshToken: string | null;
  studentId: string | null;
  commanderId: string | null;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
}

export interface UserQueryRequest {
  page?: number;
  limit?: number;
  username?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
}

export interface University {
  id: string;
  universityCode: string;
  universityName: string;
  totalStudents: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: string;
  className: string;
  studentCount: number;
  educationLevelId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  id: string;
  organizationName: string;
  travelTime: number;
  totalStudents: number;
  status: string;
  universityId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EducationLevel {
  id: string;
  levelName: string;
  organizationId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  avatar: string | null;
  birthday: string;
  cccdNumber: string;
  classId: string;
  createdAt: string;
  currentAddress: string;
  currentCpa4: number;
  currentCpa10: number;
  dateOfEnlistment: string;
  educationLevelId: string;
  email: string;
  enrollment: number;
  ethnicity: string;
  familyMember: any | null;
  foreignRelations: any | null;
  fullPartyMember: string | null;
  gender: "MALE" | "FEMALE";
  graduationDate: string | null;
  hometown: string;
  organizationId: string;
  partyMemberCardNumber: string | null;
  phoneNumber: string;
  placeOfBirth: string;
  positionGovernment: string;
  positionParty: string;
  probationaryPartyMember: string | null;
  rank: string;
  religion: string;
  unit: string;
  universityId: string;
  updatedAt: string;
  university?: University;
  class?: Class;
  organization?: Organization;
  educationLevel?: EducationLevel;
}

export interface Commander {
  id: string;
  commanderId: string;
  fullName: string;
  avatar: string | null;
  birthday: string;
  cccd: string;
  currentAddress: string;
  email: string;
  gender: "MALE" | "FEMALE";
  phoneNumber: string;
  rank: string;
  unit: string;
  positionGovernment: string;
  positionParty: string;
  startWork: number;
  hometown: string;
  placeOfBirth: string;
  ethnicity: string;
  religion: string;
  dateOfEnlistment: string | null;
  fullPartyMember: string | null;
  probationaryPartyMember: string | null;
  partyMemberCardNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailResponse extends User {
  student: Student | null;
  commander: Commander | null;
}
