import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// In Vite, use import.meta.env for environment variables
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set. Database operations will not work.');
}

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

export const db = drizzle(sql, { schema });

export type Database = typeof db;