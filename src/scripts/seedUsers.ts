import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users } from '../db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

// Load environment variables
config();

const DATABASE_URL = process.env.VITE_DATABASE_URL || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const SALT_ROUNDS = 10;

const demoUsers = [
  {
    email: 'employee@culturalstaffing.com',
    password: 'password123',
    firstName: 'Emily',
    lastName: 'Johnston',
    role: 'employee' as const,
  },
  {
    email: 'manager@culturalstaffing.com',
    password: 'password123',
    firstName: 'Michael',
    lastName: 'Campbell',
    role: 'manager' as const,
  },
  {
    email: 'admin@culturalstaffing.com',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Wilson',
    role: 'admin' as const,
  },
];

async function seedUsers() {
  console.log('🌱 Seeding demo users...\n');

  for (const user of demoUsers) {
    try {
      // Check if user already exists
      const existing = await db.select().from(users).where(eq(users.email, user.email));

      if (existing.length > 0) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      // Create user
      await db.insert(users).values({
        email: user.email,
        password: hashedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });

      console.log(`✅ Created ${user.role}: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error creating user ${user.email}:`, error);
    }
  }

  console.log('\n✨ Demo users seeded successfully!');
  console.log('\n📝 Demo Credentials:');
  console.log('   Employee: employee@culturalstaffing.com / password123');
  console.log('   Manager:  manager@culturalstaffing.com / password123');
  console.log('   Admin:    admin@culturalstaffing.com / password123\n');
}

// Run the seed function
seedUsers()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
