// Office data models

export interface Office {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface OfficeFormData {
  name: string;
}

export interface OfficesResponse {
  status: string;
  offices: Office[];
}

export interface OfficeResponse {
  status: string;
  office: Office;
}

export interface CreateOfficeRequest {
  name: string;
}

export interface UpdateOfficeRequest {
  name?: string;
}

