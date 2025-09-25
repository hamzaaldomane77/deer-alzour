// Achievement data models

export interface Achievement {
  id: number;
  name: string;
  title: string;
  date: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementFormData {
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: number;
}

export interface AchievementsResponse {
  status: string;
  achievments: Achievement[];
}

export interface AchievementResponse {
  status: string;
  achievment: Achievement;
}

export interface CreateAchievementRequest {
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: number;
}

export interface UpdateAchievementRequest {
  name?: string;
  title?: string;
  description?: string;
  date?: string;
}
