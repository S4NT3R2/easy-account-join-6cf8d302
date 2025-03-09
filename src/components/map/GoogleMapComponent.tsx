
import React, { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { ServiceProvider } from "@/types/service.types";
import { useGoogleMapInitialization } from "@/hooks/useGoogleMapInitialization";
import { useGoogleMapMarkers } from "@/hooks/useGoogleMapMarkers";
import { useGoogleUserLocationTracking } from "@/hooks/useGoogleUserLocationTracking";
import LocationSearch from "./LocationSearch";
import { Loader2 } from 'lucide-react';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (Harare, Zimbabwe)
const defaultCenter = { lat: -17.8292, lng: 31.0335 };

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    }
  ]
};

const GOOGLE_MAPS_API_KEY = "AIzaSyBGdsZiAZv4pR-FY8E8w2iuXmOUVXD95Ro"; // This is a placeholder key, replace with your own

interface GoogleMapComponentProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  selectedProvider: ServiceProvider | null;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
  serviceProviders: ServiceProvider[];
  setLocationError: (error: string | null) => void;
  isSearchOpen?: boolean;
  onCloseSearch?: () => void;
}

const GoogleMapComponent = ({ 
  userLocation, 
  setUserLocation, 
  selectedProvider, 
  setSelectedProvider,
  serviceProviders,
  setLocationError,
  isSearchOpen = false,
  onCloseSearch = () => {}
}: GoogleMapComponentProps) => {
  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Use custom hooks for different functionality
  const {
    mapContainer,
    mapRef,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation,
  } = useGoogleMapInitialization({
    userLocation,
    setUserLocation,
    setLocationError
  });

  // Hook for managing provider markers
  useGoogleMapMarkers({
    mapRef,
    markers,
    serviceProviders,
    mapInitialized,
    setSelectedProvider
  });

  // Hook for tracking user location
  useGoogleUserLocationTracking({
    mapRef,
    userMarker,
    userLocation
  });

  // Function to handle map loading
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, [mapRef]);

  // Function to handle map unmounting
  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, [mapRef]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#1A1F2C]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-white">Loading Maps...</span>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">      
      {isSearchOpen && (
        <LocationSearch 
          isGoogleMaps={true}
          map={{ current: mapRef.current }}
          mapInitialized={mapInitialized}
          onLocationSelect={(coords) => {
            setUserLocation(coords);
            if (mapRef.current) {
              mapRef.current.panTo({ lat: coords[1], lng: coords[0] });
              mapRef.current.setZoom(14);
            }
          }}
          onClose={onCloseSearch}
        />
      )}
      
      <div ref={mapContainer} className="h-full w-full">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation ? { lat: userLocation[1], lng: userLocation[0] } : defaultCenter}
          zoom={14}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        />
      </div>
    </div>
  );
};

export default GoogleMapComponent;
