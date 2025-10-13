import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center">Loading user information...</div>
      </div>
    );
  }

  // Extract user data
  const userData = {
    name: `${user.firstName} ${user.lastName}`.trim() || "User",
    email: user.email,
    role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
    department: "Healthcare",
    joinDate: user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "N/A",
    location: "Belfast, Northern Ireland",
    imageUrl: user.profileImage,
  };

  const initials = userData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
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
              <div className="flex-1">
                <h3 className="font-montserrat font-bold text-lg">{userData.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{userData.role}</p>
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
                    <Badge variant="default" className="text-xs">Verified</Badge>
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
              <div className="space-y-3">
                <h4 className="font-montserrat font-semibold">
                  Account Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Manage your account settings and security options.
                </p>

                <div className="flex flex-col gap-3">
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
                  <li>• Keep your email address up to date</li>
                  <li>• Review your account activity regularly</li>
                  <li>• Contact support if you notice anything suspicious</li>
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
                  Neon Database
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
