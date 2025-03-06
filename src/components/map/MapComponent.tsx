
import React from "react";
import { ServiceProvider } from "@/types/service.types";
import { useMapInitialization } from "@/hooks/useMapInitialization";
import { useProviderMarkers } from "@/hooks/useProviderMarkers";
import { useUserLocationTracking } from "@/hooks/useUserLocationTracking";
import { useMapStyles } from "@/hooks/useMapStyles";

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
  // Use custom hooks for different functionality
  const {
    mapContainer,
    map,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation
  } = useMapInitialization({
    userLocation,
    setUserLocation,
    setLocationError
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

  return (
    <div ref={mapContainer} className="h-full w-full" />
  );
};

export default MapComponent;
