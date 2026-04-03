export type LoginFormValues = {
  username: string;
  password: string;
  remember?: boolean;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
  };
};
