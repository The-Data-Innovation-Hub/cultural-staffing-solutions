import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isDevelopment = import.meta.env.DEV;

// Use mock auth in development if no valid Clerk key is provided
// Check if it's a real key (not the placeholder)
// You can force mock auth by setting VITE_USE_MOCK_AUTH=true in .env
const forceMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const useClerk = !forceMockAuth && PUBLISHABLE_KEY && 
                 PUBLISHABLE_KEY !== 'pk_test_your_publishable_key_here' &&
                 !PUBLISHABLE_KEY.includes('your_') &&
                 PUBLISHABLE_KEY.startsWith('pk_'); // Valid Clerk keys start with pk_

const AppWrapper = () => {
  if (useClerk) {
    return (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        appearance={{
          variables: {
            colorPrimary: "#FF8C00",
            colorBackground: "#E3F2FD",
            borderRadius: "0.5rem",
          },
          elements: {
            formButtonPrimary: 
              "bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold",
            card: "shadow-card",
          },
        }}
      >
        <App />
      </ClerkProvider>
    );
  } else {
    console.log('🔧 Development Mode: Using mock authentication');
    console.log('📝 Available test accounts:');
    console.log('  - employee@culturalstaffing.com (any password)');
    console.log('  - manager@culturalstaffing.com (any password)');
    console.log('  - admin@culturalstaffing.com (any password)');
    return (
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  }
};

createRoot(document.getElementById("root")!).render(<AppWrapper />);
