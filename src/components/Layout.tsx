import { Outlet, Routes, Route, useLocation, Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import TrainingCenter from "../pages/TrainingCenter";
import CourseView from "../pages/CourseView";
import AssessmentCenter from "../pages/AssessmentCenter";
import UserProfile from "../pages/UserProfile";
import AIGuru from "../pages/employee/AIGuru";
import Certificates from "../pages/employee/Certificates";
import WaitlistManagement from "../pages/admin/WaitlistManagement";

const Layout = () => {
  const location = useLocation();
  const currentRole = location.pathname.split('/')[1];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <img
                src="/cultural-staffing-logo.png"
                alt="Cultural Staffing Solutions"
                className="h-10 w-auto object-contain"
              />
              <h1 className="font-montserrat font-bold text-lg text-foreground">
                Cultural Staffing Solutions
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link to={`/${currentRole}/profile`}>
                <User className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Employee Routes */}
            {currentRole === 'employee' && (
              <>
                <Route index element={<EmployeeDashboard />} />
                <Route path="training" element={<TrainingCenter />} />
                <Route path="training/course/:id" element={<CourseView />} />
                <Route path="assessments" element={<AssessmentCenter />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="ai-guru" element={<AIGuru />} />
                <Route path="certificates" element={<Certificates />} />
              </>
            )}
            
            {/* Manager Routes */}
            {currentRole === 'manager' && (
              <>
                <Route index element={<ManagerDashboard />} />
                <Route path="team" element={<div className="p-6"><h1 className="text-2xl font-bold">Team Management</h1><p>Coming soon...</p></div>} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Coming soon...</p></div>} />
                <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>Coming soon...</p></div>} />
              </>
            )}
            
            {/* Admin Routes */}
            {currentRole === 'admin' && (
              <>
                <Route index element={<AdminDashboard />} />
                <Route path="waitlist" element={<WaitlistManagement />} />
                <Route path="content" element={<div className="p-6"><h1 className="text-2xl font-bold">Content Management</h1><p>Coming soon...</p></div>} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p>Coming soon...</p></div>} />
                <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">System Analytics</h1><p>Coming soon...</p></div>} />
                <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>Coming soon...</p></div>} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;