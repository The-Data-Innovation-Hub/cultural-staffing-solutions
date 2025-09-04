import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// In Vite, use import.meta.env for environment variables
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || '';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL environment variable is not set. Database operations will not work.');
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

export type Database = typeof db;