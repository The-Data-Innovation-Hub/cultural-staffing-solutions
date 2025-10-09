import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import './index.css'

console.log('🔐 Using Neon Database Authentication');
console.log('📝 Demo Credentials:');
console.log('  Employee: employee@culturalstaffing.com / password123');
console.log('  Manager:  manager@culturalstaffing.com / password123');
console.log('  Admin:    admin@culturalstaffing.com / password123');

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
