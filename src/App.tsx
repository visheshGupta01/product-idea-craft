import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import MyProjects from "./pages/MyProjects";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import UserProvider from "@/context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import { ResetPasswordModal } from "./components/auth/ResetPasswordModal";
import { EmailVerificationModal } from "./components/auth/EmailVerificationModal";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthTestPanel } from "./components/auth/AuthTestPanel";


const queryClient = new QueryClient();

const AppContent = () => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const action = searchParams.get('action');
    
    if (token && action === 'reset-password') {
      setShowResetPassword(true);
    } else if (token && action === 'verify-email') {
      setVerificationToken(token);
      setShowEmailVerification(true);
    }
  }, [searchParams]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/c/:sessionid" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <MyProjects />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
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
      
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => {
          setShowEmailVerification(false);
          window.history.replaceState({}, '', '/');
        }}
        token={verificationToken}
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
