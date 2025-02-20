
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";

const queryClient = new QueryClient();

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showSidebar = location.pathname === '/home';

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {showSidebar && (
        <>
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        </>
      )}
      
      <Toaster />
      <Sonner />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<Navigate to="/home" replace />} />
        <Route path="/bookings" element={<Navigate to="/home" replace />} />
        <Route path="/cars" element={<Navigate to="/home" replace />} />
        <Route path="/addresses" element={<Navigate to="/home" replace />} />
        <Route path="/favorites" element={<Navigate to="/home" replace />} />
        <Route path="/language" element={<Navigate to="/home" replace />} />
        <Route path="/contact" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
