import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Video, BookOpen, Clock } from "lucide-react";

export default function ContentManagement() {
  return (
    <div className="p-6 space-y-6 bg-background">
      <div>
        <h1 className="font-montserrat font-bold text-3xl text-foreground">
          Content Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage training materials, courses, and educational content
        </p>
      </div>

      {/* Coming Soon Banner */}
      <Card className="shadow-card border-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-2xl text-foreground mb-2">
                Coming Soon
              </h2>
              <p className="text-muted-foreground max-w-md">
                This feature is currently under development. Soon you'll be able to manage all your training content, courses, videos, and learning materials from this page.
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
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Upload Content
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload and organize training materials, documents, and resources for your team.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Course Builder
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create and manage structured courses with modules, lessons, and assessments.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Video className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Media Library
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage videos, images, and multimedia content for engaging learning experiences.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Document Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Store and organize important documents, policies, and reference materials.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Content Analytics
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track content usage, engagement metrics, and learning outcomes.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Upload className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <CardTitle className="font-montserrat text-lg">
                Bulk Operations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Perform bulk uploads, updates, and content organization tasks efficiently.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
