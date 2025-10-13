import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// In Vite, use import.meta.env for environment variables
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

// Only initialize database connection if URL is provided
// This prevents errors when migrating to backend API calls
let db: any = null;

if (DATABASE_URL) {
  // Configure Neon client with browser warning suppression
  // Note: We understand the security implications. Sensitive operations
  // (like authentication with password hashing) are handled on the backend.
  // This client is primarily used for read operations and non-sensitive data.
  const sql = neon(DATABASE_URL, {
    fetchOptions: {
      cache: 'no-store',
    },
    // Suppress the browser warning - we've assessed the risks
    disableWarningInBrowsers: true,
  });

  db = drizzle(sql, { schema });
} else {
  console.warn('⚠️  Direct database access is disabled. Use backend API endpoints instead.');
  console.warn('   If you see this message, courseService and userService need to be refactored.');
}

export { db };

export type Database = typeof db;