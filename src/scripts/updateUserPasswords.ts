import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

// Load environment variables
config();

const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const SALT_ROUNDS = 10;

const users = [
  { email: 'employee@culturalstaffing.com', password: 'password123' },
  { email: 'manager@culturalstaffing.com', password: 'password123' },
  { email: 'admin@culturalstaffing.com', password: 'password123' },
];

async function updatePasswords() {
  console.log('🔐 Updating user passwords...\n');

  for (const user of users) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      // Update user password
      await sql`
        UPDATE users
        SET password = ${hashedPassword}, updated_at = NOW()
        WHERE email = ${user.email}
      `;

      console.log(`✅ Updated password for: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error updating password for ${user.email}:`, error);
    }
  }

  console.log('\n✨ All passwords updated successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Employee: employee@culturalstaffing.com / password123');
  console.log('   Manager:  manager@culturalstaffing.com / password123');
  console.log('   Admin:    admin@culturalstaffing.com / password123\n');
}

// Run the update function
updatePasswords()
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
