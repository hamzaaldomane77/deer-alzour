// Branch data models

export interface Branch {
  id: number;
  name: string;
  boss: string;
  trName: string;
  created_at: string;
  updated_at: string;
}

export interface BranchFormData {
  name: string;
  boss: string;
  trName: string;
}

export interface BranchesResponse {
  status: string;
  branches: Branch[];
}

export interface BranchResponse {
  status: string;
  branch: Branch;
}

export interface CreateBranchRequest {
  name: string;
  boss: string;
  trName: string;
}

export interface UpdateBranchRequest {
  name?: string;
  boss?: string;
  trName?: string;
}

