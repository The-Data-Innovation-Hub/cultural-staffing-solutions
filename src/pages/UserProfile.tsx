import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Save } from "lucide-react";

const UserProfile = () => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Mock user data
  const userData = {
    name: "Sarah O'Connor",
    email: "sarah.oconnor@culturalstaffing.ie",
    role: "Healthcare Professional",
    department: "Nursing",
    joinDate: "March 2024",
    location: "Dublin, Ireland"
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    // Mock password change success
    toast({
      title: "Success",
      description: "Password changed successfully",
    });

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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
                <AvatarImage src="/placeholder.svg" alt={userData.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-montserrat font-bold text-lg">{userData.name}</h3>
                <p className="text-muted-foreground">{userData.role}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Label className="font-medium text-sm">Email:</Label>
                <div className="col-span-2">
                  <p className="text-sm font-medium">{userData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Label className="font-medium text-sm">Department:</Label>
                <div className="col-span-2">
                  <p className="text-sm">{userData.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Label className="font-medium text-sm">Location:</Label>
                <div className="col-span-2">
                  <p className="text-sm">{userData.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Label className="font-medium text-sm">Joined:</Label>
                <div className="col-span-2">
                  <p className="text-sm">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="font-montserrat font-bold text-xl flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button type="submit" className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="shadow-card border-0 mt-6">
        <CardHeader>
          <CardTitle className="font-montserrat font-bold text-xl">Account Settings</CardTitle>
          <CardDescription>
            Additional preferences and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-medium">Language Preference</Label>
              <p className="text-sm text-muted-foreground">English (Ireland)</p>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Notification Settings</Label>
              <p className="text-sm text-muted-foreground">Email notifications enabled</p>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Time Zone</Label>
              <p className="text-sm text-muted-foreground">GMT (Dublin)</p>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Training Reminders</Label>
              <p className="text-sm text-muted-foreground">1 day before due date</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;