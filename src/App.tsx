import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import UserProvider from "@/context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute requiredUserType="user">
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredUserType="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </UserProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
