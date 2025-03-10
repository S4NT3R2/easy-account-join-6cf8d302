
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppSidebar } from "./components/AppSidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { SplashScreen } from "./components/SplashScreen";
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
import ProfilePage from "./pages/Profile";
import AdminDashboard from "./pages/Admin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderAddSite from "./pages/ProviderAddSite";
import ProviderEditSite from "./pages/ProviderEditSite";
import ProviderAddService from "./pages/ProviderAddService";
import ProviderEditService from "./pages/ProviderEditService";
import { AuthProvider, RequireAuth } from "./hooks/useAuth";

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

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>
              <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/cars"
          element={
            <RequireAuth>
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors"
              >
                <Menu className="h-6 w-6 text-white" />
              </button>
              <AppSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
              <CarsPage />
            </RequireAuth>
          }
        />
        <Route path="/cars/add" element={<RequireAuth><AddCarPage /></RequireAuth>} />
        <Route path="/addresses" element={<RequireAuth><AddressesPage /></RequireAuth>} />
        <Route path="/addresses/add" element={<RequireAuth><AddLocationPage /></RequireAuth>} />
        <Route path="/language" element={<RequireAuth><LanguagePage /></RequireAuth>} />
        <Route path="/booking-details" element={<RequireAuth><BookingDetailsPage /></RequireAuth>} />
        <Route path="/contact" element={<RequireAuth><ContactPage /></RequireAuth>} />
        <Route path="/favorites" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
        <Route path="/provider/dashboard" element={<RequireAuth><ProviderDashboard /></RequireAuth>} />
        <Route path="/provider/add-site" element={<RequireAuth><ProviderAddSite /></RequireAuth>} />
        <Route path="/provider/edit-site/:id" element={<RequireAuth><ProviderEditSite /></RequireAuth>} />
        <Route path="/provider/add-service/:providerId" element={<RequireAuth><ProviderAddService /></RequireAuth>} />
        <Route path="/provider/edit-service/:serviceId" element={<RequireAuth><ProviderEditService /></RequireAuth>} />
        <Route path="/bookings" element={<Navigate to="/booking-details" replace />} />
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
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
