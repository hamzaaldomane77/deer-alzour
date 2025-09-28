export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface UsersResponse {
  status: string;
  users: User[];
}

export interface UserResponse {
  status: string;
  user: User;
}
