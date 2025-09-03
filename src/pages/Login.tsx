import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Users, Settings } from "lucide-react";

const Login = () => {
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple role-based routing for demo
    switch (role) {
      case 'employee':
        navigate('/employee');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/employee');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-css-white via-background to-css-grey-light flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
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

        <Card className="shadow-card border-0">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="font-montserrat font-bold text-xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your personalized training platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="font-montserrat font-medium">Select Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Employee
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manager
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-montserrat font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-montserrat font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                disabled={!role}
              >
                Sign In
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Demo Platform - Select any role to continue</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;