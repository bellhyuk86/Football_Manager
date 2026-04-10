export type Role = "manager" | "coach" | "player";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string | null;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  updateUser: (partial: Partial<User>) => void;
  hydrate: () => void;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  teamName?: string;
  inviteCode?: string;
}

export interface RegisterResult {
  inviteCode?: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  teamName: string;
  inviteCode: string;
}

export interface FindIdFormValues {
  name: string;
  email: string;
}

export interface FindPasswordFormValues {
  username: string;
  email: string;
}
