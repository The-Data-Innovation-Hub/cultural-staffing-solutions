import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Mail, User, Shield, Crown, Lock } from "lucide-react";

// Demo users for quick login
const DEMO_USERS = [
  { 
    email: "employee@culturalstaffing.com", 
    password: "password123", 
    role: "Employee",
    icon: User,
    description: "Access training courses and assessments"
  },
  { 
    email: "manager@culturalstaffing.com", 
    password: "password123", 
    role: "Manager",
    icon: Shield,
    description: "View team progress and reports"
  },
  { 
    email: "admin@culturalstaffing.com", 
    password: "password123", 
    role: "Admin",
    icon: Crown,
    description: "Full system administration"
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { isSignedIn, user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if already signed in
    if (isSignedIn && user) {
      navigate(`/${user.role}`);
    }
  }, [isSignedIn, user, navigate]);

  const handleQuickLogin = (demoUser: typeof DEMO_USERS[0]) => {
    setSelectedUser(demoUser.email);
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn(email, password);
      // Redirect will happen via useEffect when isSignedIn changes
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logos/csmart-logo.svg"
              alt="C-Smart"
              className="h-16 w-auto"
            />
          </div>
          <p className="text-slate-500 text-sm">
            AI-Driven Training & Development Platform
          </p>
          <p className="text-slate-400 text-xs mt-1">
            by Cultural Staffing Solutions
          </p>
        </div>

        {/* Quick Login Cards */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-600 mb-3 text-center">
            Quick Login (Click to fill credentials)
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((demoUser) => {
              const Icon = demoUser.icon;
              const isSelected = selectedUser === demoUser.email;
              return (
                <button
                  key={demoUser.email}
                  type="button"
                  onClick={() => handleQuickLogin(demoUser)}
                  disabled={isLoading}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md disabled:opacity-50 ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      demoUser.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-600' 
                        : demoUser.role === 'Manager'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{demoUser.role}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          demoUser.role === 'Admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : demoUser.role === 'Manager'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {isSelected ? '✓ Selected' : demoUser.role}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 truncate">{demoUser.email}</p>
                      <p className="text-xs text-slate-400 mt-1">{demoUser.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-amber-400 focus:ring-amber-400"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-semibold rounded-xl transition-all shadow-lg shadow-amber-200/50"
              disabled={isLoading || !email || !password}
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
            className="text-slate-500 hover:text-slate-700"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
