import { apiClient } from '@/lib/api';
import type { Tour, CreateTourRequest, UpdateTourRequest, ToursResponse } from '@/types/tour';

export class TourService {
  // الحصول على جميع الجولات للمستخدم الحالي
  static async getUserTours(): Promise<Tour[]> {
    try {
      const response = await apiClient.get<ToursResponse>('/user/tours');
      return response.tours;
    } catch (error) {
      console.error('خطأ في جلب الجولات:', error);
      throw error;
    }
  }

  // الحصول على جولة محددة
  static async getTour(id: number): Promise<Tour> {
    try {
      const response = await apiClient.get<{ status: string; tour: Tour }>(`/user/tours/${id}`);
      return response.tour;
    } catch (error) {
      console.error('خطأ في جلب الجولة:', error);
      throw error;
    }
  }

  // إنشاء جولة جديدة
  static async createTour(tourData: CreateTourRequest): Promise<Tour> {
    try {
      const response = await apiClient.post<{ status: string; tour: Tour }>('/user/tours', tourData);
      return response.tour;
    } catch (error) {
      console.error('خطأ في إنشاء الجولة:', error);
      throw error;
    }
  }

  // تحديث جولة موجودة
  static async updateTour(id: number, tourData: UpdateTourRequest): Promise<Tour> {
    try {
      const response = await apiClient.put<{ status: string; tour: Tour }>(`/user/tours/${id}`, tourData);
      return response.tour;
    } catch (error) {
      console.error('خطأ في تحديث الجولة:', error);
      throw error;
    }
  }

  // حذف جولة
  static async deleteTour(id: number): Promise<void> {
    try {
      await apiClient.delete<{ status: string; message: string }>(`/user/tours/${id}`);
    } catch (error) {
      console.error('خطأ في حذف الجولة:', error);
      throw error;
    }
  }
}
