import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StackProvider, StackHandler, StackTheme } from '@stackframe/react';
import { Suspense } from 'react';
import { stackClientApp } from '@/lib/stack';
import Layout from "./components/Layout";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import EmailConfirmation from "./pages/EmailConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Handler for Neon Auth routes (sign-in, sign-up, password reset, etc.)
function NeonAuthHandler() {
  const location = useLocation();
  return <StackHandler app={stackClientApp} location={location.pathname} fullPage />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login/*" element={<Login />} />
                <Route path="/confirm-email" element={<EmailConfirmation />} />
                
                {/* Neon Auth handler routes */}
                <Route path="/handler/*" element={<NeonAuthHandler />} />

                {/* Employee Routes */}
                <Route path="/employee/*" element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <Layout />
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
                
                {/* Manager Routes */}
                <Route path="/manager/*" element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <SidebarProvider>
                      <Layout />
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SidebarProvider>
                      <Layout />
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </StackTheme>
          </StackProvider>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
