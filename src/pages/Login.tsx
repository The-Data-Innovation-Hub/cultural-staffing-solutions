import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn, signIn, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSignedIn && user) {
      // Route based on user's role
      navigate(`/${user.role}`);
    }
  }, [isSignedIn, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-css-white via-background to-css-grey-light flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
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

        {/* Demo Credentials Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-css-gold/20">
          <h3 className="font-montserrat font-semibold text-sm mb-2 text-css-black">Demo Credentials (click to use):</h3>
          <div className="space-y-2 text-xs font-lato">
            <button
              type="button"
              onClick={() => fillDemoCredentials("employee@culturalstaffing.com")}
              className="w-full text-left px-3 py-2 rounded hover:bg-css-gold/10 transition-colors border border-transparent hover:border-css-gold/30"
              disabled={isLoading}
            >
              <span className="font-semibold text-css-black">Employee:</span>{" "}
              <span className="text-css-grey-dark">employee@culturalstaffing.com / password123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("manager@culturalstaffing.com")}
              className="w-full text-left px-3 py-2 rounded hover:bg-css-gold/10 transition-colors border border-transparent hover:border-css-gold/30"
              disabled={isLoading}
            >
              <span className="font-semibold text-css-black">Manager:</span>{" "}
              <span className="text-css-grey-dark">manager@culturalstaffing.com / password123</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin@culturalstaffing.com")}
              className="w-full text-left px-3 py-2 rounded hover:bg-css-gold/10 transition-colors border border-transparent hover:border-css-gold/30"
              disabled={isLoading}
            >
              <span className="font-semibold text-css-black">Admin:</span>{" "}
              <span className="text-css-grey-dark">admin@culturalstaffing.com / password123</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="font-montserrat font-bold text-xl text-foreground mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
