// API Client for the application
const BASE_URL = 'http://127.0.0.1:8000/api';

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // إذا كان الخطأ 401 (غير مصرح)، حاول تحديث الـ token
      if (response.status === 401 && this.token) {
        try {
          const refreshResponse = await fetch('http://127.0.0.1:8000/api/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${this.token}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newToken = refreshData.token || refreshData.access_token;
            
            if (newToken) {
              this.updateToken(newToken);
              // إعادة المحاولة مع الـ token الجديد
              const retryResponse = await fetch(response.url, {
                method: response.url.includes('refresh') ? 'POST' : 'GET',
                headers: this.getHeaders(),
              });
              
              if (retryResponse.ok) {
                return retryResponse.json();
              }
            }
          }
        } catch (refreshError) {
          console.error('فشل في تحديث الـ token:', refreshError);
        }
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // Update token when user logs in
  updateToken(token: string) {
    this.token = token;
  }

  // Clear token when user logs out
  clearToken() {
    this.token = null;
  }
}

// Create singleton instance
export const apiClient = new ApiClient(BASE_URL);

// Export types
export type { ApiResponse, ApiError };
