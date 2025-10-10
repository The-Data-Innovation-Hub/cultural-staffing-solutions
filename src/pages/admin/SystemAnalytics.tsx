import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Activity, Clock, PieChart } from "lucide-react";

export default function SystemAnalytics() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">
          System Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor system performance, user engagement, and business metrics
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Clock className="h-12 w-12 text-purple-600" />
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md">
                This feature is currently under development. Soon you'll have access to comprehensive analytics dashboards, real-time metrics, and detailed reports about system usage and performance.
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
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Usage Statistics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track platform usage metrics, active users, session durations, and engagement rates.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Growth Trends
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze growth patterns, user acquisition trends, and retention metrics over time.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                User Analytics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor user behavior, demographics, activity patterns, and conversion funnels.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                System Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track system health, response times, error rates, and infrastructure metrics.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <PieChart className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Training Metrics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze course completion rates, assessment scores, and learning outcomes.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Custom Reports
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and export custom reports tailored to your specific business needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
