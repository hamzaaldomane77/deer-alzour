import { apiClient } from '@/lib/api';
import type { User, UsersResponse, UserResponse, CreateUserRequest, UpdateUserRequest, UpdatePasswordRequest } from '@/types/user';

export const UserService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<UsersResponse>('/admin/users');
    return response.users;
  },

  async getUser(id: number): Promise<User> {
    const response = await apiClient.get<UserResponse>(`/admin/users/${id}`);
    return response.user;
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<UserResponse>('/admin/users', data);
    return response.user;
  },

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put<UserResponse>(`/admin/users/${id}`, data);
    return response.user;
  },

  async updatePassword(id: number, data: UpdatePasswordRequest): Promise<void> {
    await apiClient.put<void>(`/admin/update_password/${id}`, data);
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete<void>(`/admin/users/${id}`);
  },
};
