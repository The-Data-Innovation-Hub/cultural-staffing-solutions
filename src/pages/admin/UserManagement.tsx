import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Shield, Users, Settings, Clock, UserCog } from "lucide-react";

export default function UserManagement() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users, roles, permissions, and access control
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Clock className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md">
                This feature is currently under development. Soon you'll be able to manage all user accounts, assign roles, set permissions, and control access to system features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Create Users
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add new users to the platform and configure their basic profile information.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Role Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Assign and manage user roles including Employee, Manager, and Administrator.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Settings className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Permissions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure granular permissions and access controls for different user groups.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                User Directory
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse, search, and filter all users with advanced search capabilities.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <UserCog className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Account Settings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage user account settings, status, and security configurations.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Shield className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Audit Logs
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track user activities, login history, and security events for compliance.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
