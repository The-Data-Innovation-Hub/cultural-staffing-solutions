# Neon Auth & Data API Setup Guide

This guide explains how to complete the Neon Auth migration and use the Data API for Cultural Staffing Solutions.

## Prerequisites

1. A Neon database account (you already have this)
2. Access to your Neon Console

---

## Part 1: Neon Data API

The Neon Data API provides REST endpoints to access your database directly without a custom backend.

### Your Data API Endpoint

```
https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1
```

### Environment Variable

Add to your `.env`:

```bash
VITE_NEON_API_URL=https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1
VITE_NEON_API_KEY=your_api_key_here  # Get from Neon Console -> Settings -> API Keys
```

### Using the Data API

```typescript
import { getNeonAuthUsers, getFullUser, addToWaitlist } from '@/lib/neonDataApi';

// Get all users from Neon Auth
const users = await getNeonAuthUsers();

// Get a user with their profile
const user = await getFullUser('user-id-here');

// Add to waitlist
await addToWaitlist({ email: 'test@example.com', name: 'Test User' });
```

### REST API Examples

```bash
# Get all users (with API key)
curl "https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1/neon_auth.users_sync" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get user by email
curl "https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1/neon_auth.users_sync?email=eq.user@example.com" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Insert into waitlist
curl "https://ep-nameless-mouse-a9gutuik.apirest.gwc.azure.neon.tech/neondb/rest/v1/waitlist" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "name": "Test User"}'
```

### Setting Up Row Level Security (RLS)

For production, enable RLS to restrict access based on the authenticated user:

```sql
-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.user_id());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.user_id());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.user_id() AND role = 'admin'
    )
  );
```

---

## Part 2: Neon Auth

## Step 1: Enable Neon Auth in Neon Console

1. Go to [console.neon.tech](https://console.neon.tech)
2. Open your project
3. Navigate to the **Auth** section in the left sidebar
4. Click **Enable Neon Auth**

## Step 2: Get Your Environment Variables

After enabling Neon Auth, go to the **Configuration** tab and select **React (Vite)** as your framework.

Copy these environment variables to your `.env` file:

```bash
# Neon Auth environment variables for React (Vite)
VITE_STACK_PROJECT_ID=your_project_id_here
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key_here
STACK_SECRET_SERVER_KEY=your_secret_key_here
```

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Go to [http://localhost:8080/login](http://localhost:8080/login)
3. You should see the "Quick Sign In with Neon Auth" option
4. Click **Sign Up** to create a test user
5. Check your Neon database: `SELECT * FROM neon_auth.users_sync;`

## How Neon Auth Works

When users sign up or log in through Neon Auth:

1. Their credentials are securely managed by Stack Auth
2. User profiles are automatically synced to `neon_auth.users_sync` table
3. You can query and JOIN this data with your existing tables

### The `neon_auth.users_sync` Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | User's unique ID |
| name | TEXT | User's display name |
| email | TEXT | User's email address |
| created_at | TIMESTAMP | When user was created |
| updated_at | TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | Soft delete timestamp (null if active) |
| raw_json | JSONB | Full user data from Stack Auth |

## Step 4: Migrate Existing Users (Optional)

If you have existing users in your `users` table, you can migrate them to Neon Auth:

### Option A: Re-registration (Simpler)
- Existing users create new accounts via Neon Auth
- Link old data by email address

### Option B: Bulk Import (Via Stack Auth API)
```bash
# Export existing users
SELECT email, first_name || ' ' || last_name as name 
FROM users;

# Import to Stack Auth using their Admin API
# See: https://docs.stack-auth.com/api-reference
```

## Step 5: Create User Profiles Table for Roles

Since Neon Auth doesn't store roles, create a profiles table:

```sql
-- Create a profiles table linked to Neon Auth users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,
  role VARCHAR(20) DEFAULT 'employee' CHECK (role IN ('employee', 'manager', 'admin')),
  department VARCHAR(100),
  location VARCHAR(100),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
```

## Files Changed

The following files have been updated for Neon Auth:

- `src/lib/stack.ts` - Stack Auth client configuration
- `src/App.tsx` - Added StackProvider and handler routes
- `src/pages/Login.tsx` - Added Neon Auth sign-in/sign-up buttons

## Auth Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  Login Page     │────▶│  Neon Auth       │────▶│  Your Database  │
│  /login         │     │  /handler/*      │     │  neon_auth.*    │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                                                 │
        │                                                 │
        └─────────── Legacy Auth (temporary) ─────────────┘
```

## Support

- [Neon Auth Documentation](https://neon.com/docs/neon-auth/overview)
- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Neon Discord](https://discord.gg/92vNTzKDGp)

