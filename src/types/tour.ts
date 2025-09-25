export interface Tour {
  id: number;
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTourRequest {
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: string;
}

export interface UpdateTourRequest {
  name: string;
  title: string;
  description: string;
  date: string;
}

export interface ToursResponse {
  status: string;
  tours: Tour[];
}
