import { Sweet, AuthResponse, SweetsResponse, SearchFilters, PurchaseRequest, PurchaseResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3001');

class ApiService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: { message: 'Network error', status: response.status } 
      }));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Authentication endpoints
  async register(email: string, password: string, role: 'admin' | 'customer' = 'customer'): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, role }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  // Sweet endpoints
  async getSweets(filters?: SearchFilters & { limit?: number; offset?: number }): Promise<SweetsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await fetch(`${API_BASE_URL}/api/sweets?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<SweetsResponse>(response);
  }

  async searchSweets(filters: SearchFilters): Promise<SweetsResponse> {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('q', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await fetch(`${API_BASE_URL}/api/sweets/search?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<SweetsResponse>(response);
  }

  async createSweet(sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<{ sweet: Sweet; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sweets`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(sweetData),
    });
    return this.handleResponse<{ sweet: Sweet; message: string }>(response);
  }

  async updateSweet(id: string, sweetData: Partial<Omit<Sweet, 'id' | 'created_at' | 'updated_at'>>): Promise<{ sweet: Sweet; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sweets/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(sweetData),
    });
    return this.handleResponse<{ sweet: Sweet; message: string }>(response);
  }

  async deleteSweet(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sweets/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async purchaseSweet(id: string, purchaseData: PurchaseRequest): Promise<PurchaseResponse> {
    const response = await fetch(`${API_BASE_URL}/api/sweets/${id}/purchase`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(purchaseData),
    });
    return this.handleResponse<PurchaseResponse>(response);
  }

  async restockSweet(id: string, quantity: number): Promise<{ sweet: Sweet; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/sweets/${id}/restock`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ quantity }),
    });
    return this.handleResponse<{ sweet: Sweet; message: string }>(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<{ status: string; message: string }>(response);
  }
}

export const apiService = new ApiService();