import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import UserProvider from "@/context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { ResetPasswordModal } from "./components/auth/ResetPasswordModal";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthTestPanel } from "./components/auth/AuthTestPanel";


const queryClient = new QueryClient();

const AppContent = () => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const resetToken = searchParams.get('token');
    const action = searchParams.get('action');
    
    if (resetToken && action === 'reset-password') {
      setShowResetPassword(true);
    }
  }, [searchParams]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/testing/*" element={<AuthTestPanel />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onSuccess={() => {
          setShowResetPassword(false);
          window.history.replaceState({}, '', '/');
        }}
      />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </UserProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
