import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock environment variables
beforeAll(() => {
  process.env.VITE_API_URL = 'http://localhost:3001';
  process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
  process.env.VITE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdybGRocXVhaWt4YWlta2pidHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTUwNzksImV4cCI6MjA3Mzc5MTA3OX0.xqxLG-X0wteRxh-Jov5BVnGIAc2DWom1zrouOKXQ6Cc';
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test cleanup
afterAll(() => {
  cleanup();
});