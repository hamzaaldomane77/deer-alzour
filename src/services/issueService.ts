import { apiClient } from '@/lib/api';
import type { Issue, CreateIssueRequest, UpdateIssueRequest, IssuesResponse } from '@/types/issue';

export class IssueService {
  // الحصول على جميع القضايا للمستخدم الحالي
  static async getUserIssues(): Promise<Issue[]> {
    try {
      const response = await apiClient.get<IssuesResponse>('/user/issues');
      return response.issues;
    } catch (error) {
      console.error('خطأ في جلب القضايا:', error);
      throw error;
    }
  }

  // الحصول على قضية محددة
  static async getIssue(id: number): Promise<Issue> {
    try {
      const response = await apiClient.get<{ status: string; issue: Issue }>(`/user/issues/${id}`);
      return response.issue;
    } catch (error) {
      console.error('خطأ في جلب القضية:', error);
      throw error;
    }
  }

  // إنشاء قضية جديدة
  static async createIssue(issueData: CreateIssueRequest): Promise<Issue> {
    try {
      const response = await apiClient.post<{ status: string; issue: Issue }>('/user/issues', issueData);
      return response.issue;
    } catch (error) {
      console.error('خطأ في إنشاء القضية:', error);
      throw error;
    }
  }

  // تحديث قضية موجودة
  static async updateIssue(id: number, issueData: UpdateIssueRequest): Promise<Issue> {
    try {
      const response = await apiClient.put<{ status: string; issue: Issue }>(`/user/issues/${id}`, issueData);
      return response.issue;
    } catch (error) {
      console.error('خطأ في تحديث القضية:', error);
      throw error;
    }
  }

  // حذف قضية
  static async deleteIssue(id: number): Promise<void> {
    try {
      await apiClient.delete<{ status: string; message: string }>(`/user/issues/${id}`);
    } catch (error) {
      console.error('خطأ في حذف القضية:', error);
      throw error;
    }
  }
}
