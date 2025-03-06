
import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapboxToken } from './useMapboxToken';
import { useMapCreation } from './useMapCreation';
import { useLocationWatcher } from './useLocationWatcher';

interface UseMapInitializationProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  setLocationError: (error: string | null) => void;
  mapboxToken?: string;
}

interface UseMapInitializationResult {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.RefObject<mapboxgl.Map | null>;
  userMarker: React.RefObject<mapboxgl.Marker | null>;
  markers: React.MutableRefObject<mapboxgl.Marker[]>;
  mapInitialized: boolean;
  getUserLocation: () => Promise<void>;
  isTokenRequired: boolean;
  setMapboxToken: (token: string) => void;
}

export const useMapInitialization = ({
  userLocation,
  setUserLocation,
  setLocationError,
  mapboxToken: initialToken
}: UseMapInitializationProps): UseMapInitializationResult => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  
  // Use our token management hook
  const { isTokenRequired, setMapboxToken } = useMapboxToken(initialToken);
  
  // Default location (Harare) if user location is not available
  const initialLocation = userLocation || [31.0335, -17.8292];
  
  // Use our map creation hook
  const { map, mapInitialized } = useMapCreation({
    containerRef: mapContainer,
    initialLocation,
    isTokenRequired
  });
  
  // Use our location watcher hook
  const { getUserLocation } = useLocationWatcher({
    map,
    userMarker,
    mapInitialized,
    setUserLocation,
    setLocationError
  });

  return {
    mapContainer,
    map,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation,
    isTokenRequired,
    setMapboxToken
  };
};
