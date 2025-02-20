
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";
import CarsPage from "./pages/Cars";
import AddCarPage from "./pages/AddCar";
import AddressesPage from "./pages/Addresses";
import AddLocationPage from "./pages/AddLocation";
import LanguagePage from "./pages/Language";
import BookingDetailsPage from "./pages/BookingDetails";
import ContactPage from "./pages/Contact";
import FavoritesPage from "./pages/Favorites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const showSidebar = !['/login', '/signup'].includes(location.pathname);

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
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/add" element={<AddCarPage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/addresses/add" element={<AddLocationPage />} />
        <Route path="/language" element={<LanguagePage />} />
        <Route path="/booking-details" element={<BookingDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<Navigate to="/home" replace />} />
        <Route path="/bookings" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster />
      <Sonner />
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
