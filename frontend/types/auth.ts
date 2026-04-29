export type LoginFormValues = {
  username: string;
  password: string;
};

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  roleId: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}


export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

