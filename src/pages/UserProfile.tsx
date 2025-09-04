import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Use Clerk authentication
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">Loading user information...</div>
      </div>
    );
  }

  // Extract user data from Clerk
  const userData = {
    name: user.fullName || `${user.firstName} ${user.lastName}` || user.username || "User",
    email: user.primaryEmailAddress?.emailAddress || "",
    role: (user.publicMetadata?.role as string) || "Employee",
    department: (user.publicMetadata?.department as string) || "Healthcare",
    joinDate: user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "Unknown",
    location: (user.publicMetadata?.location as string) || "Belfast, Northern Ireland",
    imageUrl: user.imageUrl,
    verified: user.primaryEmailAddress?.verification?.status === "verified",
    lastSignIn: user.lastSignInAt ? format(new Date(user.lastSignInAt), "PPpp") : "Never",
  };

  const initials = userData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      navigate('/login');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-foreground">User Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Information */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold text-xl flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.imageUrl} alt={userData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-montserrat font-bold text-lg">{userData.name}</h3>
                <p className="text-muted-foreground text-sm">{userData.role}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                  <p className="text-foreground flex items-center gap-2">
                    {userData.email}
                    {userData.verified && (
                      <Badge variant="default" className="text-xs">Verified</Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p className="text-foreground">{userData.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground">{userData.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-foreground">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Last Sign In</p>
                <p className="text-foreground">{userData.lastSignIn}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-montserrat font-semibold">
                  Clerk Account Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings, security options, and more through Clerk's secure interface.
                </p>
                
                <div className="flex flex-col gap-3">
                  <UserButton 
                    afterSignOutUrl="/login"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        userButtonTrigger: "w-full justify-start bg-background border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md",
                        userButtonPopoverCard: "shadow-lg",
                      }
                    }}
                  />
                  
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-montserrat font-semibold text-sm mb-2">Security Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Review your account activity regularly</li>
                  <li>• Keep your email address up to date</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="shadow-card border-0 mt-6">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold text-xl">Training Preferences</CardTitle>
          <CardDescription>
            Customize your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Preferred Language</p>
              <p className="text-foreground">English</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Time Zone</p>
              <p className="text-foreground">GMT (Belfast, Northern Ireland)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Notification Preferences</p>
              <p className="text-foreground">Email & In-App</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Learning Path</p>
              <p className="text-foreground">Healthcare Professional Track</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
              <p className="text-foreground font-medium capitalize">
                <Badge variant="default">{userData.role}</Badge>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Authentication Mode</p>
              <p className="text-foreground">
                <Badge variant="default">
                  Clerk (Production)
                </Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;