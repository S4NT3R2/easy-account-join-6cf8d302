
import { Car, Settings, Calendar, MapPin, Search, Phone, Heart, Navigation2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// You'll need to replace this with your actual Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOXBzZWkwMXUyMnFxbzhtbml4NnRrIn0.JDk3EwlcTF1HenYHiNx9DQ';

interface Service {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

interface Car {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
}

interface ServiceProvider {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  cost: number;
  image: string;
  location: [number, number];
}

const serviceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Quickwash Services",
    address: "104, Hilton Street, Chillicolate, USA",
    rating: 4.5,
    distance: "2.5 km",
    cost: 60,
    image: "/lovable-uploads/480bcf4d-f31d-4960-a1f6-2805e938dbe2.png",
    location: [-93.552, 40.0215],
  },
  {
    id: "2",
    name: "Premium Car Wash",
    address: "220 Main Street, Downtown, USA",
    rating: 4.8,
    distance: "1.2 km",
    cost: 75,
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    location: [-93.562, 40.0225],
  },
  {
    id: "3",
    name: "Sparkle & Shine",
    address: "55 Park Avenue, Uptown, USA",
    rating: 4.3,
    distance: "3.1 km",
    cost: 55,
    image: "/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png",
    location: [-93.542, 40.0205],
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  
  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-93.552, 40.0215],
        zoom: 12
      });

      map.current.on('load', () => {
        setMapInitialized(true);
        
        // Add markers for service providers
        serviceProviders.forEach((provider) => {
          const markerEl = document.createElement('div');
          markerEl.className = 'custom-marker';
          markerEl.innerHTML = `<div class="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm p-2 cursor-pointer hover:scale-110 transition-transform">
            <img src="${provider.image}" class="w-full h-full object-cover rounded-full" />
          </div>`;
          
          markerEl.addEventListener('click', () => {
            setSelectedProvider(provider);
          });

          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat(provider.location)
            .addTo(map.current!);
          
          markers.current.push(marker);
        });
      });

      return () => {
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Error",
        description: "Could not load the map. Please try again later.",
        variant: "destructive",
      });
    }
  }, [mapInitialized]);

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
  };

  const handleBookNow = () => {
    if (!selectedCar || !selectedService || !selectedDateTime) {
      toast({
        title: "Missing information",
        description: "Please select all required booking details",
        variant: "destructive",
      });
      return;
    }
    navigate("/booking-details");
  };

  return (
    <div className="relative h-screen w-full bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="absolute inset-0 bg-[#1A1F2C]">
        <div ref={mapContainer} className="h-full w-full" />
      </div>

      {/* Provider Info Card */}
      {selectedProvider && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#232836]/95 backdrop-blur-sm p-4 rounded-lg shadow-lg w-80">
          <div className="flex items-start gap-4">
            <img 
              src={selectedProvider.image} 
              alt={selectedProvider.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{selectedProvider.name}</h3>
                <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
                  {selectedProvider.rating} ★
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{selectedProvider.address}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Navigation2 className="w-4 h-4" />
                  {selectedProvider.distance}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  ${selectedProvider.cost}
                </div>
              </div>
              <button 
                onClick={handleBookNow}
                className="w-full mt-3 bg-gradient-to-r from-primary to-primary/80 text-secondary font-medium py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent pt-20">
        <div className="glass-morphism mx-4 mb-4 rounded-2xl p-6 space-y-6 bg-[#232836]/90">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setIsSelectCarOpen(true)} 
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Select Car</span>
              {selectedCar && (
                <span className="text-xs text-gray-400">{selectedCar.name}</span>
              )}
            </button>
            
            <button 
              onClick={() => setIsServicesOpen(true)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Services</span>
              {selectedService && (
                <span className="text-xs text-gray-400">{selectedService.name}</span>
              )}
            </button>
            
            <button 
              onClick={() => setIsDateTimeOpen(true)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">When?</span>
              {selectedDateTime && (
                <span className="text-xs text-gray-400">
                  {selectedDateTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              )}
            </button>
          </div>

          {/* Location Search */}
          <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#2A2F3C] hover:bg-[#2F3447] transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#232836] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-sm text-white block">Service Location</span>
                <span className="text-xs text-gray-400">104, Hilton Street, Chillicolate, USA</span>
              </div>
            </div>
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Bottom Sheets */}
      <SelectCarSheet
        open={isSelectCarOpen}
        onOpenChange={setIsSelectCarOpen}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
      />

      <ServicesSheet
        open={isServicesOpen}
        onOpenChange={setIsServicesOpen}
        selectedService={selectedService}
        onSelectService={setSelectedService}
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
