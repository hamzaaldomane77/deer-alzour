export interface Issue {
  id: number;
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateIssueRequest {
  name: string;
  title: string;
  description: string;
  date: string;
  user_id: string;
}

export interface UpdateIssueRequest {
  name: string;
  title: string;
  description: string;
  date: string;
}

export interface IssuesResponse {
  status: string;
  issues: Issue[];
}
