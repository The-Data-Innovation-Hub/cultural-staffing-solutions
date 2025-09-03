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
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Employee Routes */}
            <Route path="/employee" element={<Layout />}>
              <Route index element={<EmployeeDashboard />} />
              <Route path="training" element={<TrainingCenter />} />
              <Route path="training/course/:id" element={<CourseView />} />
              <Route path="assessments" element={<AssessmentCenter />} />
            </Route>
            
            {/* Manager Routes */}
            <Route path="/manager" element={<Layout />}>
              <Route index element={<ManagerDashboard />} />
              <Route path="team" element={<div>Team Management</div>} />
              <Route path="reports" element={<div>Reports</div>} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Layout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="content" element={<div>Content Management</div>} />
              <Route path="users" element={<div>User Management</div>} />
              <Route path="analytics" element={<div>System Analytics</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
