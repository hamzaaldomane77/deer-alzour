import { apiClient } from '@/lib/api';
import type { 
  Office, 
  OfficesResponse, 
  OfficeResponse, 
  CreateOfficeRequest, 
  UpdateOfficeRequest 
} from '@/types/office';

export class OfficeService {
  // Get all offices
  static async getOffices(): Promise<Office[]> {
    try {
      const response: OfficesResponse = await apiClient.get('/admin/offices');
      return response.offices;
    } catch (error) {
      console.error('Error fetching offices:', error);
      throw error;
    }
  }

  // Get single office by ID
  static async getOffice(id: number): Promise<Office> {
    try {
      const response: OfficeResponse = await apiClient.get(`/admin/offices/${id}`);
      return response.office;
    } catch (error) {
      console.error('Error fetching office:', error);
      throw error;
    }
  }

  // Create new office
  static async createOffice(data: CreateOfficeRequest): Promise<Office> {
    try {
      const response: OfficeResponse = await apiClient.post('/admin/offices', data);
      return response.office;
    } catch (error) {
      console.error('Error creating office:', error);
      throw error;
    }
  }

  // Update office
  static async updateOffice(id: number, data: UpdateOfficeRequest): Promise<Office> {
    try {
      const response: OfficeResponse = await apiClient.put(`/admin/offices/${id}`, data);
      return response.office;
    } catch (error) {
      console.error('Error updating office:', error);
      throw error;
    }
  }

  // Delete office
  static async deleteOffice(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/offices/${id}`);
    } catch (error) {
      console.error('Error deleting office:', error);
      throw error;
    }
  }
}

