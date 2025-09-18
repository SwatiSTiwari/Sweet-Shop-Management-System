export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ApiError {
  error: {
    message: string;
    status: number;
    details?: any[];
  };
}

export interface SweetsResponse {
  sweets: Sweet[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PurchaseRequest {
  quantity: number;
}

export interface PurchaseResponse {
  message: string;
  purchase: {
    sweet_id: string;
    sweet_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    remaining_stock: number;
  };
  sweet: Sweet;
}