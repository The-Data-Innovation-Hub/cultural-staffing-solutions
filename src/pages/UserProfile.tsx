import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Shield, Calendar, MapPin, Briefcase, LogOut, Lock, CheckCircle2, AlertCircle, Loader2, Edit2, X, Camera, Save } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAccessToken } from "@/services/authService";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, signOut, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedDepartment, setEditedDepartment] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Profile image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

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
    department: user.department || "Healthcare",
    joinDate: user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "N/A",
    location: user.location || "Belfast, Northern Ireland",
    imageUrl: user.profileImage,
  };

  const initials = userData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedFirstName(user.firstName || "");
    setEditedLastName(user.lastName || "");
    setEditedDepartment(user.department || "Healthcare");
    setEditedLocation(user.location || "Belfast, Northern Ireland");
    setProfileError("");
    setProfileSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedFirstName("");
    setEditedLastName("");
    setEditedDepartment("");
    setEditedLocation("");
    setSelectedImage(null);
    setImagePreview(null);
    setProfileError("");
    setProfileSuccess("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileError("Image size must be less than 5MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        setProfileError("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      setSelectedImage(file);
      setProfileError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setProfileError("");
    setProfileSuccess("");
    setIsSavingProfile(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const token = getAccessToken();

      // Upload image if selected
      if (selectedImage) {
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append('profileImage', selectedImage);

        const imageResponse = await fetch(`${API_BASE_URL}/users/profile-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: formData
        });

        if (!imageResponse.ok) {
          const error = await imageResponse.json();
          throw new Error(error.message || 'Failed to upload profile image');
        }

        // Get the updated user data with new profile image
        const imageData = await imageResponse.json();
        console.log('Profile image uploaded:', imageData);

        // Immediately update the user in context and localStorage with the new image
        if (imageData && imageData.profileImage) {
          const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
          const updatedUser = { ...currentUser, profileImage: imageData.profileImage };
          localStorage.setItem('authUser', JSON.stringify(updatedUser));
          console.log('Updated user in localStorage:', updatedUser);
        }

        setIsUploadingImage(false);
      }

      // Update profile information
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: editedFirstName,
          lastName: editedLastName,
          department: editedDepartment,
          location: editedLocation
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setProfileSuccess("Profile updated successfully!");
      setIsEditing(false);
      setSelectedImage(null);
      setImagePreview(null);

      // Refresh user data to get updated profile including any new image
      console.log('📡 Calling refreshUser() to update profile data...');
      await refreshUser();
      console.log('✅ refreshUser() completed. Updated user:', user);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setProfileSuccess("");
      }, 5000);

    } catch (error: any) {
      setProfileError(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
      setIsUploadingImage(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    setIsChangingPassword(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const token = getAccessToken();

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setPasswordSuccess("");
      }, 5000);

    } catch (error: any) {
      setPasswordError(error.message || "Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Account Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="font-montserrat font-bold text-xl">
                    Profile Information
                  </CardTitle>
                </div>
                {!isEditing && (
                  <Button
                    onClick={handleEditClick}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              {profileSuccess && (
                <Alert className="border-green-500 bg-green-50 text-green-900">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={imagePreview || userData.imageUrl}
                      alt={userData.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSavingProfile || isUploadingImage}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editedFirstName}
                          onChange={(e) => setEditedFirstName(e.target.value)}
                          placeholder="First Name"
                          disabled={isSavingProfile}
                        />
                        <Input
                          value={editedLastName}
                          onChange={(e) => setEditedLastName(e.target.value)}
                          placeholder="Last Name"
                          disabled={isSavingProfile}
                        />
                      </div>
                      <p className="text-muted-foreground text-sm">{userData.role}</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-montserrat font-bold text-lg">{userData.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{userData.role}</p>
                    </>
                  )}
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
                    {isEditing ? (
                      <Input
                        value={editedDepartment}
                        onChange={(e) => setEditedDepartment(e.target.value)}
                        placeholder="Department"
                        disabled={isSavingProfile}
                      />
                    ) : (
                      <p className="text-foreground">{userData.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    {isEditing ? (
                      <Input
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        placeholder="Location"
                        disabled={isSavingProfile}
                      />
                    ) : (
                      <p className="text-foreground">{userData.location}</p>
                    )}
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

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile || isUploadingImage}
                    className="flex-1 bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                  >
                    {isSavingProfile || isUploadingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    disabled={isSavingProfile || isUploadingImage}
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Security Tab */}
        <TabsContent value="security" className="space-y-6">
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
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                    placeholder="Enter your new password (min. 8 characters)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                    placeholder="Confirm your new password"
                  />
                </div>

                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {passwordSuccess && (
                  <Alert className="border-green-500 bg-green-50 text-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{passwordSuccess}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-gold text-css-black hover:bg-css-gold font-montserrat font-bold"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-montserrat font-semibold">Password Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• At least 8 characters long</li>
                  <li>• Different from your current password</li>
                  <li>• Use a unique password you don't use elsewhere</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="font-montserrat font-bold text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account Management
              </CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-montserrat font-semibold text-sm mb-2">Security Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Change your password regularly</li>
                  <li>• Never share your password with anyone</li>
                  <li>• Use a password manager for added security</li>
                  <li>• Contact support if you notice suspicious activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="shadow-card border-0">
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
                    <Badge variant="default">Neon Database</Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
