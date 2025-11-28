import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-css-gold"></div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user's actual role
      return <Navigate to={`/${user.role}`} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
