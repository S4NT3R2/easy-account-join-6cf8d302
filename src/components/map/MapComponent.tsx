
import { useRef, useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "sonner";
import { ServiceProvider } from "@/types/service.types";

// Initialize mapbox with a temporary token
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHNxOXBzZWkwMXUyMnFxbzhtbml4NnRrIn0.JDk3EwlcTF1HenYHiNx9DQ';

interface MapComponentProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  selectedProvider: ServiceProvider | null;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
  serviceProviders: ServiceProvider[];
  setLocationError: (error: string | null) => void;
}

const MapComponent = ({ 
  userLocation, 
  setUserLocation, 
  selectedProvider, 
  setSelectedProvider,
  serviceProviders,
  setLocationError
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

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

  // Update service provider markers
  const updateServiceProviderMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for service providers
    serviceProviders.forEach((provider) => {
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
  }, [mapInitialized, userLocation]);

  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation) {
      // Update user marker position
      if (userMarker.current) {
        userMarker.current.setLngLat(userLocation);
      }
    }
  }, [userLocation]);

  // Update markers when service providers change
  useEffect(() => {
    if (mapInitialized) {
      updateServiceProviderMarkers();
    }
  }, [serviceProviders, mapInitialized]);

  // Function to handle provider selection
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

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
};

export default MapComponent;
