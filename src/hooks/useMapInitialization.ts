
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { addMapControls } from '@/components/map/MapControls';
import { createUserMarker } from '@/components/map/MapMarker';
import { ServiceProvider } from '@/types/service.types';
import { watchPosition, clearWatch, getCurrentLocation } from '@/services/LocationService';

interface UseMapInitializationProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  setLocationError: (error: string | null) => void;
}

interface UseMapInitializationResult {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.RefObject<mapboxgl.Map | null>;
  userMarker: React.RefObject<mapboxgl.Marker | null>;
  markers: React.MutableRefObject<mapboxgl.Marker[]>;
  mapInitialized: boolean;
  getUserLocation: () => Promise<void>;
}

export const useMapInitialization = ({
  userLocation,
  setUserLocation,
  setLocationError
}: UseMapInitializationProps): UseMapInitializationResult => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const styleElement = useRef<HTMLStyleElement | null>(null);
  const watchId = useRef<number | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Function to get user's current location
  const getUserLocation = async () => {
    const { coords, error } = await getCurrentLocation();
    setUserLocation(coords);
    setLocationError(error);

    if (map.current) {
      map.current.flyTo({
        center: coords,
        zoom: 13,
        duration: 1500
      });
      
      // Update or create user marker
      if (userMarker.current) {
        userMarker.current.setLngLat(coords);
      } else if (map.current) {
        userMarker.current = createUserMarker(coords, map.current);
      }
    }
  };

  // Initialize map
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
        
        // Add map controls
        addMapControls({ map: map.current });
      });

      // Set up real-time location updates
      watchId.current = watchPosition(
        (position) => {
          setUserLocation(position);
          
          if (userMarker.current) {
            userMarker.current.setLngLat(position);
          }
        },
        (error) => {
          console.error('Error watching position:', error);
          setLocationError(error);
        }
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
        if (watchId.current !== null) {
          clearWatch(watchId.current);
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLocationError(`Could not load the map: ${errorMessage}`);
    }
  }, [mapInitialized, userLocation, setUserLocation, setLocationError]);

  return {
    mapContainer,
    map,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation
  };
};
