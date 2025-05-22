export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  message: string;
  isAuthenticated: boolean;
  userName: string;
  email: string;
  roles: string[];
  token: string;
  expiresOn: Date;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  roles: string[];
} 