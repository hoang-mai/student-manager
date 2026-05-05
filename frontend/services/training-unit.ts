import apiClient from "./axios-client";
import { ENDPOINTS } from "@/constants/endpoints";

export interface University {
  id: string;
  universityCode: string;
  universityName: string;
  totalStudents: number;
  status: 'ACTIVE' | 'INACTIVE';
  organizations?: Organization[];
}

export interface Organization {
  id: string;
  organizationName: string;
  travelTime: number;
  totalStudents: number;
  status: 'ACTIVE' | 'INACTIVE';
  universityId: string;
  educationLevels?: EducationLevel[];
}

export interface EducationLevel {
  id: string;
  levelName: string;
  organizationId: string;
  classes?: Class[];
}

export interface Class {
  id: string;
  className: string;
  studentCount: number;
  educationLevelId: string;
}

const { TRAINING_UNITS: T } = ENDPOINTS;

export const trainingUnitService = {
  // University
  getUniversities: (params?: any) => apiClient.get(T.UNIVERSITIES, { params }),
  getUniversityHierarchy: () => apiClient.get<University[]>(T.UNIVERSITY_HIERARCHY),
  createUniversity: (data: any) => apiClient.post(T.UNIVERSITIES, data),
  updateUniversity: (id: string, data: any) => apiClient.put(`${T.UNIVERSITIES}/${id}`, data),
  deleteUniversity: (id: string) => apiClient.delete(`${T.UNIVERSITIES}/${id}`),

  // Organization
  getOrganizations: (params?: any) => apiClient.get(T.ORGANIZATIONS, { params }),
  createOrganization: (data: any) => apiClient.post(T.ORGANIZATIONS, data),
  updateOrganization: (id: string, data: any) => apiClient.put(`${T.ORGANIZATIONS}/${id}`, data),
  deleteOrganization: (id: string) => apiClient.delete(`${T.ORGANIZATIONS}/${id}`),

  // Education Level
  getEducationLevels: (params?: any) => apiClient.get(T.EDUCATION_LEVELS, { params }),
  createEducationLevel: (data: any) => apiClient.post(T.EDUCATION_LEVELS, data),
  updateEducationLevel: (id: string, data: any) => apiClient.put(`${T.EDUCATION_LEVELS}/${id}`, data),
  deleteEducationLevel: (id: string) => apiClient.delete(`${T.EDUCATION_LEVELS}/${id}`),

  // Class
  getClasses: (params?: any) => apiClient.get(T.CLASSES, { params }),
  createClass: (data: any) => apiClient.post(T.CLASSES, data),
  updateClass: (id: string, data: any) => apiClient.put(`${T.CLASSES}/${id}`, data),
  deleteClass: (id: string) => apiClient.delete(`${T.CLASSES}/${id}`),
};
