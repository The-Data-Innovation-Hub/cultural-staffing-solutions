import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, useAuth, useUser } from "@clerk/clerk-react";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      // Route based on user's role from publicMetadata
      const role = (user.publicMetadata?.role as string) || 'employee';
      navigate(`/${role}`);
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-css-white via-background to-css-grey-light flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
              <span className="text-css-black font-montserrat font-bold text-lg">CSS</span>
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-2xl text-foreground">
                Cultural Staffing Solutions
              </h1>
              <p className="text-muted-foreground text-sm">
                AI-Driven Training & Development
              </p>
            </div>
          </div>
        </div>

        <SignIn 
          routing="path"
          path="/login"
          signUpUrl="/login"
          afterSignInUrl="/employee"
          appearance={{
            elements: {
              formButtonPrimary: "bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;