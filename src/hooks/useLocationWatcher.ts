
import { useRef, useEffect } from 'react';
import { createUserMarker } from '@/components/map/MapMarker';
import { watchPosition, clearWatch, getCurrentLocation } from '@/services/LocationService';
import mapboxgl from 'mapbox-gl';

interface UseLocationWatcherProps {
  map: React.RefObject<mapboxgl.Map | null>;
  userMarker: React.RefObject<mapboxgl.Marker | null>;
  mapInitialized: boolean;
  setUserLocation: (location: [number, number] | null) => void;
  setLocationError: (error: string | null) => void;
}

interface UseLocationWatcherResult {
  getUserLocation: () => Promise<void>;
}

export const useLocationWatcher = ({
  map,
  userMarker,
  mapInitialized,
  setUserLocation,
  setLocationError
}: UseLocationWatcherProps): UseLocationWatcherResult => {
  const watchId = useRef<number | null>(null);
  const isManualLocationRequest = useRef<boolean>(false);

  // Initialize location watching
  useEffect(() => {
    if (!mapInitialized) return;
    
    getCurrentLocation().then(({ coords, error }) => {
      setUserLocation(coords);
      setLocationError(error);
      
      if (coords && map.current) {
        if (!userMarker.current) {
          userMarker.current = createUserMarker(coords, map.current);
        } else {
          userMarker.current.setLngLat(coords);
        }
      }
      
      watchId.current = watchPosition(
        (position) => {
          setUserLocation(position);
          
          if (userMarker.current) {
            userMarker.current.setLngLat(position);
          } else if (map.current) {
            userMarker.current = createUserMarker(position, map.current);
          }
          
          if (isManualLocationRequest.current && map.current) {
            map.current.flyTo({
              center: position,
              zoom: 14,
              duration: 1000
            });
          }
        },
        (error) => {
          console.error('Error watching position:', error);
          setLocationError(error);
        }
      );
    });

    return () => {
      if (watchId.current !== null) {
        clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [mapInitialized, map, userMarker, setUserLocation, setLocationError]);

  const getUserLocation = async () => {
    if (!map.current) return;
    isManualLocationRequest.current = true;
    
    const { coords, error } = await getCurrentLocation();
    setUserLocation(coords);
    setLocationError(error);

    if (map.current) {
      map.current.flyTo({
        center: coords,
        zoom: 14,
        duration: 1500
      });
      
      if (userMarker.current) {
        userMarker.current.setLngLat(coords);
      } else if (map.current) {
        userMarker.current = createUserMarker(coords, map.current);
      }
    }
    
    setTimeout(() => {
      isManualLocationRequest.current = false;
    }, 2000);
  };

  return {
    getUserLocation
  };
};
