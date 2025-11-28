import { Navigate } from "react-router-dom";
import { useUser as useStackUser } from "@stackframe/react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * Get user role from email address
 * For demo users, the role is determined by the email pattern
 */
function getRoleFromEmail(email: string | undefined): string {
  if (!email) return 'employee';
  const lowerEmail = email.toLowerCase();
  
  if (lowerEmail.includes('admin')) return 'admin';
  if (lowerEmail.includes('manager')) return 'manager';
  return 'employee';
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useAuth();
  const stackUser = useStackUser();

  // Check if user is authenticated via either method
  const isAuthenticated = isSignedIn || !!stackUser;
  const isLoadingAuth = !isLoaded && !stackUser;

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-css-gold"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine user role
  let userRole = 'employee';
  
  if (stackUser) {
    // Neon Auth user - get role from email
    userRole = getRoleFromEmail(stackUser.primaryEmail || undefined);
  } else if (user) {
    // Legacy auth user
    userRole = user.role || 'employee';
  }

  // Check roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      // Redirect based on user's actual role
      return <Navigate to={`/${userRole}`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
