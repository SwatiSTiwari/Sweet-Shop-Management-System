import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock environment variables
beforeAll(() => {
  process.env.VITE_API_URL = 'http://localhost:3001';
  process.env.VITE_SUPABASE_URL = 'http://localhost:54321';
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Global test cleanup
afterAll(() => {
  cleanup();
});