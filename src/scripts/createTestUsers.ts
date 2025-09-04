import { Clerk } from '@clerk/clerk-sdk-node';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Clerk with your secret key
const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

// Test users data
const testUsers = [
  {
    emailAddress: 'employee@culturalstaffing.com',
    password: 'TestEmployee123!',
    firstName: 'Emily',
    lastName: 'Johnson',
    publicMetadata: {
      role: 'employee',
      department: 'Healthcare',
      location: 'Dublin, Ireland'
    }
  },
  {
    emailAddress: 'manager@culturalstaffing.com',
    password: 'TestManager123!',
    firstName: 'Michael',
    lastName: 'O\'Sullivan',
    publicMetadata: {
      role: 'manager',
      department: 'Healthcare Management',
      location: 'Cork, Ireland'
    }
  },
  {
    emailAddress: 'admin@culturalstaffing.com',
    password: 'TestAdmin123!',
    firstName: 'Sarah',
    lastName: 'Murphy',
    publicMetadata: {
      role: 'admin',
      department: 'Administration',
      location: 'Dublin, Ireland'
    }
  }
];

async function createTestUsers() {
  console.log('🚀 Creating test users in Clerk...\n');

  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUsers = await clerk.users.getUserList({
        emailAddress: [userData.emailAddress]
      });

      if (existingUsers.length > 0) {
        console.log(`⚠️  User ${userData.emailAddress} already exists`);
        
        // Update the user's metadata if needed
        const existingUser = existingUsers[0];
        await clerk.users.updateUser(existingUser.id, {
          publicMetadata: userData.publicMetadata
        });
        console.log(`✅ Updated metadata for ${userData.emailAddress}`);
      } else {
        // Create new user
        const user = await clerk.users.createUser({
          emailAddress: [userData.emailAddress],
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          publicMetadata: userData.publicMetadata,
          skipPasswordChecks: true,
          skipPasswordRequirement: false
        });

        console.log(`✅ Created user: ${userData.emailAddress}`);
        console.log(`   Name: ${userData.firstName} ${userData.lastName}`);
        console.log(`   Role: ${userData.publicMetadata.role}`);
        console.log(`   Password: ${userData.password}`);
        console.log('');
      }
    } catch (error: any) {
      console.error(`❌ Failed to create/update ${userData.emailAddress}:`, error.errors?.[0]?.message || error.message);
    }
  }

  console.log('\n📋 Test Users Summary:');
  console.log('=======================');
  testUsers.forEach(user => {
    console.log(`\n${user.publicMetadata.role.toUpperCase()}:`);
    console.log(`  Email: ${user.emailAddress}`);
    console.log(`  Password: ${user.password}`);
    console.log(`  Role: ${user.publicMetadata.role}`);
  });

  console.log('\n✨ Test users setup complete!');
  console.log('You can now sign in with any of these accounts at your application.\n');
}

// Run the script
createTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });