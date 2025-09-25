import { apiClient } from '@/lib/api';
import type { 
  Achievement, 
  AchievementsResponse, 
  AchievementResponse, 
  CreateAchievementRequest, 
  UpdateAchievementRequest 
} from '@/types/achievement';

export class AchievementService {
  // Get all achievements for a user
  static async getAchievements(): Promise<Achievement[]> {
    try {
      const response: AchievementsResponse = await apiClient.get('/user/achievments');
      return response.achievments;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  }

  // Get single achievement by ID
  static async getAchievement(id: number): Promise<Achievement> {
    try {
      const response: AchievementResponse = await apiClient.get(`/user/achievments/${id}`);
      return response.achievment;
    } catch (error) {
      console.error('Error fetching achievement:', error);
      throw error;
    }
  }

  // Create new achievement
  static async createAchievement(data: CreateAchievementRequest): Promise<Achievement> {
    try {
      const response: AchievementResponse = await apiClient.post('/user/achievments', data);
      return response.achievment;
    } catch (error) {
      console.error('Error creating achievement:', error);
      throw error;
    }
  }

  // Update achievement
  static async updateAchievement(id: number, data: UpdateAchievementRequest): Promise<Achievement> {
    try {
      const response: AchievementResponse = await apiClient.put(`/user/achievments/${id}`, data);
      return response.achievment;
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  }

  // Delete achievement
  static async deleteAchievement(id: number): Promise<void> {
    try {
      await apiClient.delete(`/user/achievments/${id}`);
    } catch (error) {
      console.error('Error deleting achievement:', error);
      throw error;
    }
  }
}
