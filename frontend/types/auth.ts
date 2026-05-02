export type LoginFormValues = {
  username: string;
  password: string;
};

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  role: "ADMIN" | "COMMANDER" | "STUDENT";
  refreshToken: string | null;
  studentId: string | null;
  commanderId: string | null;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
