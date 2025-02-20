
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[url('/lovable-uploads/75aaeeac-3b66-4d69-a8da-b12e9346e9c0.png')] bg-cover bg-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          
          <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/home" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<Navigate to="/login" replace />} />
              <Route path="/bookings" element={<Navigate to="/login" replace />} />
              <Route path="/cars" element={<Navigate to="/login" replace />} />
              <Route path="/addresses" element={<Navigate to="/login" replace />} />
              <Route path="/favorites" element={<Navigate to="/login" replace />} />
              <Route path="/language" element={<Navigate to="/login" replace />} />
              <Route path="/contact" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
