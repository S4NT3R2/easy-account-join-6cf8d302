
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";
import GoogleMapComponent from "@/components/map/GoogleMapComponent";
import ServiceProviderCard from "@/components/providers/ServiceProviderCard";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import LocateButton from "@/components/buttons/LocateButton";
import { mockServiceProviders } from "@/data/mockData";
import { Car, Service, ServiceProvider } from "@/types/service.types";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  
  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleBookNow = () => {
    if (!selectedCar || !selectedService || !selectedDateTime) {
      toast.error("Please select a car, service, and time before booking.");
      return;
    }
    navigate("/booking-details");
  };

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(`Error getting location: ${error.message}`);
          toast.error(`Could not access your location: ${error.message}`);
          
          // Default to Harare if location access fails
          setUserLocation([31.0335, -17.8292]);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      
      // Default to Harare if geolocation not supported
      setUserLocation([31.0335, -17.8292]);
    }
  };

  // Create properly typed handlers for our components
  const handleSelectCar = (car: Car) => {
    setSelectedCar(car);
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  return (
    <div className="relative h-screen w-full bg-[#1A1F2C]">
      <div className="absolute inset-0 bg-[#1A1F2C]">
        <GoogleMapComponent
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          serviceProviders={mockServiceProviders}
          setLocationError={setLocationError}
          isSearchOpen={isSearchOpen}
          onCloseSearch={() => setIsSearchOpen(false)}
        />
      </div>

      <LocateButton onClick={getUserLocation} />

      {selectedProvider && (
        <ServiceProviderCard 
          provider={selectedProvider} 
          onBookNow={handleBookNow}
          userLocation={userLocation}
        />
      )}

      <BottomNavigation
        onSelectCarClick={() => setIsSelectCarOpen(true)}
        onServicesClick={() => setIsServicesOpen(true)}
        onDateTimeClick={() => setIsDateTimeOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        userLocation={userLocation}
      />

      <SelectCarSheet
        open={isSelectCarOpen}
        onOpenChange={setIsSelectCarOpen}
        selectedCar={selectedCar}
        onSelectCar={handleSelectCar}
      />

      <ServicesSheet
        open={isServicesOpen}
        onOpenChange={setIsServicesOpen}
        selectedService={selectedService}
        onSelectService={handleSelectService}
      />

      <DateTimeSheet
        open={isDateTimeOpen}
        onOpenChange={setIsDateTimeOpen}
        selectedDateTime={selectedDateTime}
        onSelectDateTime={setSelectedDateTime}
      />
    </div>
  );
};

export default HomePage;
