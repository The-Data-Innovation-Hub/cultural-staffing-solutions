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
          <Route path="/employee/*" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          } />
          
          {/* Manager Routes */}
          <Route path="/manager/*" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
