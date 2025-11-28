/**
 * Setup Demo Users Script
 * 
 * This script creates demo users in Neon Auth and assigns their roles
 * in the user_profiles table.
 * 
 * Run with: npx tsx src/scripts/setupDemoUsers.ts
 */

import { stackClientApp } from '../lib/stack';

const DEMO_USERS = [
  { 
    email: "employee@culturalstaffing.com", 
    password: "password123", 
    name: "Demo Employee",
    role: "employee" as const
  },
  { 
    email: "manager@culturalstaffing.com", 
    password: "password123", 
    name: "Demo Manager",
    role: "manager" as const
  },
  { 
    email: "admin@culturalstaffing.com", 
    password: "password123", 
    name: "Demo Admin",
    role: "admin" as const
  },
];

const NEON_API_URL = process.env.VITE_NEON_API_URL;
const NEON_API_KEY = process.env.VITE_NEON_API_KEY;

async function createUserProfile(userId: string, role: 'employee' | 'manager' | 'admin') {
  if (!NEON_API_URL || !NEON_API_KEY) {
    console.error('❌ VITE_NEON_API_URL and VITE_NEON_API_KEY must be set');
    return false;
  }

  try {
    const response = await fetch(`${NEON_API_URL}/user_profiles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NEON_API_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        id: userId,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to create profile for ${userId}:`, error);
      return false;
    }

    console.log(`✅ Created profile with role "${role}" for user ${userId}`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating profile:`, error);
    return false;
  }
}

async function setupDemoUsers() {
  console.log('🚀 Setting up demo users...\n');

  for (const user of DEMO_USERS) {
    console.log(`\n📧 Processing: ${user.email} (${user.role})`);
    
    try {
      // Try to sign up the user via Stack Auth
      const result = await stackClientApp.signUpWithCredential({
        email: user.email,
        password: user.password,
      });

      if (result.status === 'ok' && result.user) {
        console.log(`✅ Created user: ${user.email}`);
        
        // Create the user profile with role
        await createUserProfile(result.user.id, user.role);
      } else if (result.status === 'error') {
        // User might already exist
        console.log(`⚠️ User may already exist: ${user.email}`);
        console.log(`   Error: ${result.error?.message}`);
      }
    } catch (error: any) {
      console.error(`❌ Error creating ${user.email}:`, error.message);
    }
  }

  console.log('\n✨ Demo user setup complete!');
  console.log('\nYou can now log in with:');
  DEMO_USERS.forEach(u => {
    console.log(`  - ${u.role}: ${u.email} / ${u.password}`);
  });
}

// Run if called directly
setupDemoUsers().catch(console.error);

