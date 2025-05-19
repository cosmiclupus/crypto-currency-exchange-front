export interface User {
  id: string;
  username: string;
  btcBalance: number;
  usdBalance: number;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginRequest {
  username: string;
}