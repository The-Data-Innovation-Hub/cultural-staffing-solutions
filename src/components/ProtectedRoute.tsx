import { Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Get user role from Clerk publicMetadata, default to 'employee'
  const userRole = (user?.publicMetadata?.role as string) || 'employee';

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-css-gold"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
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