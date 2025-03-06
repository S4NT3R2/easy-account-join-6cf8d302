
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseUserLocationTrackingProps {
  map: React.RefObject<mapboxgl.Map | null>;
  userMarker: React.MutableRefObject<mapboxgl.Marker | null>;
  userLocation: [number, number] | null;
}

export const useUserLocationTracking = ({
  map,
  userMarker,
  userLocation
}: UseUserLocationTrackingProps): void => {
  const prevLocation = useRef<[number, number] | null>(null);
  const isInitialLocation = useRef<boolean>(true);
  
  // Update map when user location changes
  useEffect(() => {
    if (!map.current || !userLocation || !userMarker.current) return;
    
    // Only fly to the location on the initial location set
    if (isInitialLocation.current && userLocation) {
      map.current.flyTo({
        center: userLocation,
        zoom: 14,
        duration: 1500
      });
      isInitialLocation.current = false;
    }
    
    // Calculate distance between previous and current location
    // Only update marker position, don't move the map
    userMarker.current.setLngLat(userLocation);
    
    // Store current location for next comparison
    prevLocation.current = userLocation;
    
  }, [userLocation, map, userMarker]);
};
