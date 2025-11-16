import { apiClient } from '@/lib/api';
import type { 
  Branch, 
  BranchesResponse, 
  BranchResponse, 
  CreateBranchRequest, 
  UpdateBranchRequest 
} from '@/types/branch';

export class BranchService {
  // Get all branches
  static async getBranches(): Promise<Branch[]> {
    try {
      const response: BranchesResponse = await apiClient.get('/admin/branches');
      return response.branches;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  }

  // Get single branch by ID
  static async getBranch(id: number): Promise<Branch> {
    try {
      const response: BranchResponse = await apiClient.get(`/admin/branches/${id}`);
      return response.branch;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  // Create new branch
  static async createBranch(data: CreateBranchRequest): Promise<Branch> {
    try {
      const response: BranchResponse = await apiClient.post('/admin/branches', data);
      return response.branch;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  // Update branch
  static async updateBranch(id: number, data: UpdateBranchRequest): Promise<Branch> {
    try {
      const response: BranchResponse = await apiClient.put(`/admin/branches/${id}`, data);
      return response.branch;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  // Delete branch
  static async deleteBranch(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/branches/${id}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
}

