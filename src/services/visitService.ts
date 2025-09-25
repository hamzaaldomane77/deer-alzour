import { apiClient } from '@/lib/api';
import type { Visit, CreateVisitRequest, UpdateVisitRequest, VisitsResponse } from '@/types/visit';

export class VisitService {
  // الحصول على جميع الزيارات للمستخدم الحالي
  static async getUserVisits(): Promise<Visit[]> {
    try {
      const response = await apiClient.get<VisitsResponse>('/user/visits');
      return response.visits;
    } catch (error) {
      console.error('خطأ في جلب الزيارات:', error);
      throw error;
    }
  }

  // الحصول على زيارة محددة
  static async getVisit(id: number): Promise<Visit> {
    try {
      const response = await apiClient.get<{ status: string; visit: Visit }>(`/user/visits/${id}`);
      return response.visit;
    } catch (error) {
      console.error('خطأ في جلب الزيارة:', error);
      throw error;
    }
  }

  // إنشاء زيارة جديدة
  static async createVisit(visitData: CreateVisitRequest): Promise<Visit> {
    try {
      const response = await apiClient.post<{ status: string; visit: Visit }>('/user/visits', visitData);
      return response.visit;
    } catch (error) {
      console.error('خطأ في إنشاء الزيارة:', error);
      throw error;
    }
  }

  // تحديث زيارة موجودة
  static async updateVisit(id: number, visitData: UpdateVisitRequest): Promise<Visit> {
    try {
      const response = await apiClient.put<{ status: string; visit: Visit }>(`/user/visits/${id}`, visitData);
      return response.visit;
    } catch (error) {
      console.error('خطأ في تحديث الزيارة:', error);
      throw error;
    }
  }

  // حذف زيارة
  static async deleteVisit(id: number): Promise<void> {
    try {
      await apiClient.delete<{ status: string; message: string }>(`/user/visits/${id}`);
    } catch (error) {
      console.error('خطأ في حذف الزيارة:', error);
      throw error;
    }
  }
}
