export interface Visit {
  id: number;
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVisitRequest {
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: string;
}

export interface UpdateVisitRequest {
  name: string;
  title: string;
  description: string;
  date: string;
}

export interface VisitsResponse {
  status: string;
  visits: Visit[];
}
