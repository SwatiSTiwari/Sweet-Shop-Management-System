import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '***' + supabaseServiceKey.slice(-4) : 'not set');

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
// fileURLToPath is now imported from 'url' module above.

