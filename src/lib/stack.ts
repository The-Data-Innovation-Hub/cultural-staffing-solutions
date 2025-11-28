/**
 * Neon Auth / Stack Auth Configuration
 * 
 * This file configures the Stack Auth client for use with Neon Auth.
 * Users are automatically synced to the neon_auth.users_sync table.
 * 
 * Setup instructions:
 * 1. Go to your Neon Console -> Auth section
 * 2. Click "Enable Neon Auth"
 * 3. Copy the environment variables to your .env file
 */

import { StackClientApp } from '@stackframe/react';

// Create the Stack Auth client app
export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: 'cookie',
  // URLs for auth handlers - point to the StackHandler route
  urls: {
    signIn: '/handler/sign-in',
    signUp: '/handler/sign-up',
    afterSignIn: '/employee',
    afterSignUp: '/employee',
    afterSignOut: '/',
    home: '/',
  },
});

// Export for use in components
export default stackClientApp;

