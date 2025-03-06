
import React, { useState } from "react";
import { ServiceProvider } from "@/types/service.types";
import { useMapInitialization } from "@/hooks/useMapInitialization";
import { useProviderMarkers } from "@/hooks/useProviderMarkers";
import { useUserLocationTracking } from "@/hooks/useUserLocationTracking";
import { useMapStyles } from "@/hooks/useMapStyles";
import MapTokenInput from "./MapTokenInput";
import LocationSearch from "./LocationSearch";
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  selectedProvider: ServiceProvider | null;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
  serviceProviders: ServiceProvider[];
  setLocationError: (error: string | null) => void;
  isSearchOpen?: boolean;
  onCloseSearch?: () => void;
}

const MapComponent = ({ 
  userLocation, 
  setUserLocation, 
  selectedProvider, 
  setSelectedProvider,
  serviceProviders,
  setLocationError,
  isSearchOpen = false,
  onCloseSearch = () => {}
}: MapComponentProps) => {
  const [mapboxToken, setMapboxToken] = useState<string | undefined>(
    localStorage.getItem('mapbox_token') || undefined
  );
  
  // Use custom hooks for different functionality
  const {
    mapContainer,
    map,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation,
    isTokenRequired,
    setMapboxToken: setMapToken
  } = useMapInitialization({
    userLocation,
    setUserLocation,
    setLocationError,
    mapboxToken
  });

  // Hook for managing provider markers
  useProviderMarkers({
    map,
    markers,
    serviceProviders,
    mapInitialized,
    setSelectedProvider
  });

  // Hook for tracking user location
  useUserLocationTracking({
    map,
    userMarker,
    userLocation
  });

  // Hook for map styles
  useMapStyles();

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setMapToken(token);
  };

  return (
    <div className="h-full w-full relative">
      {isTokenRequired && <MapTokenInput onTokenSubmit={handleTokenSubmit} />}
      
      {isSearchOpen && (
        <LocationSearch 
          map={map}
          mapInitialized={mapInitialized}
          onLocationSelect={setUserLocation}
          onClose={onCloseSearch}
        />
      )}
      
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default MapComponent;
