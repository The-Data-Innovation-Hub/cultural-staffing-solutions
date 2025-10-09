/**
 * Script to clear test entries from the waitlist table
 *
 * Usage:
 *   npm run db:clear-waitlist              - Clear all waitlist entries
 *   npm run db:clear-waitlist -- --email=test@example.com  - Clear specific email
 */

import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { waitlist } from '../db/schema';
import { eq } from 'drizzle-orm';

// Load environment variables
config();

// Get database URL from environment
const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL or VITE_DATABASE_URL not found in environment variables');
  process.exit(1);
}

// Create database connection for Node.js environment
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function clearWaitlist() {
  const args = process.argv.slice(2);
  const emailArg = args.find(arg => arg.startsWith('--email='));
  const specificEmail = emailArg ? emailArg.split('=')[1] : null;

  try {
    if (specificEmail) {
      // Clear specific email
      console.log(`🗑️  Clearing waitlist entry for: ${specificEmail}`);

      const result = await db
        .delete(waitlist)
        .where(eq(waitlist.email, specificEmail))
        .returning();

      if (result.length > 0) {
        console.log(`✅ Deleted entry for ${specificEmail}`);
        console.log(`   - Signup Date: ${result[0].signupDate}`);
        console.log(`   - Status: ${result[0].status}`);
        console.log(`   - Email Confirmed: ${result[0].confirmedEmail}`);
      } else {
        console.log(`⚠️  No entry found for ${specificEmail}`);
      }
    } else {
      // Clear all entries
      console.log('🗑️  Clearing ALL waitlist entries...');
      console.log('⚠️  This will delete all entries from the waitlist table!');

      // Get count first
      const entries = await db.select().from(waitlist);
      const count = entries.length;

      if (count === 0) {
        console.log('ℹ️  Waitlist is already empty');
        return;
      }

      console.log(`   Found ${count} entries to delete`);

      // Delete all
      await db.delete(waitlist);

      console.log(`✅ Deleted ${count} entries from waitlist`);
    }

    console.log('✨ Done!');
  } catch (error) {
    console.error('❌ Error clearing waitlist:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
clearWaitlist();
