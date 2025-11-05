import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import UserProvider from "@/context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import Navbar from "./components/landing_page/Navbar";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DeveloperDashboard = lazy(() => import("./pages/DeveloperDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MyProjects = lazy(() => import("./pages/MyProjects"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailed = lazy(() => import("./pages/PaymentFailed"));
const SharedChat = lazy(() => import("./pages/SharedChat"));
const UserTasks = lazy(() => import("./pages/UserTasks"));
const UserInbox = lazy(() => import("./pages/UserInbox"));
const Pricing = lazy(() => import("./pages/Pricing"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AuthTestPanel = lazy(() => import("./components/auth/AuthTestPanel").then(m => ({ default: m.AuthTestPanel })));
const ResetPasswordModal = lazy(() => import("./components/auth/ResetPasswordModal").then(m => ({ default: m.ResetPasswordModal })));
const EmailVerificationModal = lazy(() => import("./components/auth/EmailVerificationModal").then(m => ({ default: m.EmailVerificationModal })));


const queryClient = new QueryClient();

const AppContent = () => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [searchParams] = useSearchParams();
  const location = useLocation();

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

  // Show navbar only on specific routes
  const showNavbar = location.pathname === '/projects' || location.pathname === '/tasks' || location.pathname === '/inbox';

  return (
    <>
      {showNavbar && <Navbar />}
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
        <Route path="/chat/:sessionid" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute>
            <MyProjects />
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <UserTasks />
          </ProtectedRoute>
        } />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/share-chat" element={
          <ProtectedRoute>
            <SharedChat />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/inbox" element={
          <ProtectedRoute>
            <UserInbox />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/developer/*" element={
          <ProtectedRoute requireDeveloper>
            <DeveloperDashboard />
          </ProtectedRoute>
        } />
        <Route path="/testing/*" element={<AuthTestPanel />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      <Suspense fallback={null}>
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
      </Suspense>
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
