import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Shield, Palette, Mail, Clock, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure system preferences, security, and application settings
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Clock className="h-12 w-12 text-orange-600" />
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md">
                This feature is currently under development. Soon you'll be able to configure all system settings, manage notifications, customize the platform, and control security preferences.
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
                <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                General Settings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure basic system preferences, time zones, language, and regional settings.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Notifications
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage notification preferences, email alerts, and system announcements.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Security Settings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure authentication, password policies, two-factor authentication, and security rules.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Palette className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Appearance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customize themes, colors, branding, logos, and visual presentation of the platform.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Mail className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Email Configuration
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up email templates, SMTP settings, and automated email workflows.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Database className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                System Maintenance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage backups, data retention, system logs, and maintenance schedules.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
