import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TrainingCenter from "./pages/TrainingCenter";
import CourseView from "./pages/CourseView";
import AssessmentCenter from "./pages/AssessmentCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          }>
            <Route index element={<EmployeeDashboard />} />
            <Route path="training" element={<TrainingCenter />} />
            <Route path="training/course/:id" element={<CourseView />} />
            <Route path="assessments" element={<AssessmentCenter />} />
          </Route>
          
          {/* Manager Routes */}
          <Route path="/manager" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          }>
            <Route index element={<ManagerDashboard />} />
            <Route path="team" element={<div className="p-6"><h1 className="text-2xl font-bold">Team Management</h1><p>Coming soon...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Coming soon...</p></div>} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<div className="p-6"><h1 className="text-2xl font-bold">Content Management</h1><p>Coming soon...</p></div>} />
            <Route path="users" element={<div className="p-6"><h1 className="text-2xl font-bold">User Management</h1><p>Coming soon...</p></div>} />
            <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">System Analytics</h1><p>Coming soon...</p></div>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
