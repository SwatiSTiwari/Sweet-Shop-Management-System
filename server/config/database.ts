import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

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