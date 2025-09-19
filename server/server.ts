import app from './app.js';
import { fileURLToPath } from 'url';
import path from 'path';

// For Vercel serverless functions
export default app;

// For local development (ESM-safe)
const __filename = fileURLToPath(import.meta.url);

// When executed directly with `node` or `npx tsx`, the entry script will match
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`🍭 Sweet Shop API server is running on port ${PORT}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}