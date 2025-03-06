
import { Car, Settings, Calendar, MapPin, Search, Navigation2, Locate } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Initialize mapbox with a temporary token
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

// Zimbabwe-based service providers
const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Premium Car Wash",
    address: "104, Harare Street, Zimbabwe",
    rating: 4.8,
    distance: "0.8 km",
    cost: 80,
    image: "/lovable-uploads/480bcf4d-f31d-4960-a1f6-2805e938dbe2.png",
    location: [31.0335, -17.8292], // Harare coordinates
  },
  {
    id: "2",
    name: "Deluxe Auto Care",
    address: "456 Bulawayo Ave, Zimbabwe",
    rating: 4.6,
    distance: "1.2 km",
    cost: 95,
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    location: [28.5833, -20.1500], // Bulawayo coordinates
  },
  {
    id: "3",
    name: "Elite Car Services",
    address: "789 Victoria Falls Road, Zimbabwe",
    rating: 4.9,
    distance: "1.5 km",
    cost: 120,
    image: "/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png",
    location: [25.8373, -17.9244], // Victoria Falls coordinates
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  
  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 13,
              duration: 1500
            });
            
            // Update or create user marker
            if (userMarker.current) {
              userMarker.current.setLngLat([longitude, latitude]);
            } else if (map.current) {
              const userEl = document.createElement('div');
              userEl.className = 'user-location-marker';
              userEl.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center pulse-animation">
                  <div class="w-4 h-4 rounded-full bg-white"></div>
                </div>
              `;
              
              userMarker.current = new mapboxgl.Marker(userEl)
                .setLngLat([longitude, latitude])
                .addTo(map.current);
            }
          }
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

  // Initialize map with user's location
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;
    
    try {
      // First try to get user location
      getUserLocation();
      
      // Initialize map with default location (will be updated when user location is available)
      const defaultLocation: [number, number] = [31.0335, -17.8292]; // Harare, Zimbabwe
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation || defaultLocation,
        zoom: 13
      });

      map.current.on('load', () => {
        if (!map.current) return;
        setMapInitialized(true);
        
        // Add service provider markers
        updateServiceProviderMarkers();
        
        // If user location is available, add user marker
        if (userLocation && map.current) {
          const userEl = document.createElement('div');
          userEl.className = 'user-location-marker';
          userEl.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center pulse-animation">
              <div class="w-4 h-4 rounded-full bg-white"></div>
            </div>
          `;
          
          userMarker.current = new mapboxgl.Marker(userEl)
            .setLngLat(userLocation)
            .addTo(map.current);
        }
      });

      // Add location control to get current location
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add CSS for the pulse animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
      `;
      document.head.appendChild(style);

      // Set up real-time location updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          
          if (userMarker.current) {
            userMarker.current.setLngLat([longitude, latitude]);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        // Clean up
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        
        if (userMarker.current) {
          userMarker.current = null;
        }
        
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        
        // Remove watch position
        navigator.geolocation.clearWatch(watchId);
        
        // Remove style element
        document.head.removeChild(style);
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error("Could not load the map. Please try again later.");
    }
  }, [mapInitialized]);

  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      // Update user marker position
      if (userMarker.current) {
        userMarker.current.setLngLat(userLocation);
      }
    }
  }, [userLocation]);

  // Function to update service provider markers
  const updateServiceProviderMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for service providers
    mockServiceProviders.forEach((provider) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm p-2 cursor-pointer hover:scale-110 transition-transform">
          <img src="${provider.image}" class="w-full h-full object-cover rounded-full" alt="${provider.name}" />
        </div>
      `;
      
      markerEl.addEventListener('click', () => {
        setSelectedProvider(provider);
      });

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(provider.location)
        .addTo(map.current);
      
      markers.current.push(marker);
    });
  };

  const handleProviderSelect = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    
    if (map.current && provider.location) {
      map.current.flyTo({
        center: provider.location,
        zoom: 14,
        duration: 1500
      });
    }
  };

  const handleBookNow = () => {
    if (!selectedCar || !selectedService || !selectedDateTime) {
      toast.error("Please select a car, service, and time before booking.");
      return;
    }
    navigate("/booking-details");
  };

  const handleLocateMe = () => {
    getUserLocation();
  };

  return (
    <div className="relative h-screen w-full bg-[#1A1F2C]">
      <div className="absolute inset-0 bg-[#1A1F2C]">
        <div ref={mapContainer} className="h-full w-full" />
      </div>

      {/* Locate me button */}
      <button 
        onClick={handleLocateMe}
        className="absolute top-20 right-4 z-10 bg-[#232836] p-3 rounded-full shadow-lg hover:bg-[#2c3143] transition-colors"
      >
        <Locate className="w-5 h-5 text-primary" />
      </button>

      {selectedProvider && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#232836]/95 backdrop-blur-sm p-4 rounded-xl shadow-lg w-80">
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
                className="w-full mt-3 bg-primary text-background font-medium py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent pt-16">
        <div className="mx-4 mb-8 space-y-6">
          <div className="grid grid-cols-3 gap-8">
            <button 
              onClick={() => setIsSelectCarOpen(true)} 
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
                <Car className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-base text-white font-normal">Select Car</span>
            </button>
            
            <button 
              onClick={() => setIsServicesOpen(true)}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
                <Settings className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-base text-white font-normal">Services</span>
            </button>
            
            <button 
              onClick={() => setIsDateTimeOpen(true)}
              className="flex flex-col items-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>
              <span className="text-base text-white font-normal">When?</span>
            </button>
          </div>

          <div className="bg-[#232836] rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1A1F2C] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-white text-lg font-medium mb-1">Service Location</h3>
                <p className="text-gray-400">
                  {userLocation ? "Using your current location" : "104, Harare Street, Zimbabwe"}
                </p>
              </div>
              <Search className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>

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
