
import { useEffect, useRef } from 'react';

interface UseGoogleUserLocationTrackingProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  userMarker: React.MutableRefObject<google.maps.Marker | null>;
  userLocation: [number, number] | null;
}

export const useGoogleUserLocationTracking = ({
  mapRef,
  userMarker,
  userLocation
}: UseGoogleUserLocationTrackingProps): void => {
  const prevLocation = useRef<[number, number] | null>(null);
  const isInitialLocation = useRef<boolean>(true);
  
  // Update map when user location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation || !userMarker.current) return;
    
    const position = { lat: userLocation[1], lng: userLocation[0] };
    
    // Only fly to the location on the initial location set
    if (isInitialLocation.current && userLocation) {
      mapRef.current.panTo(position);
      mapRef.current.setZoom(14);
      isInitialLocation.current = false;
    }
    
    // Update marker position, don't move the map
    userMarker.current.setPosition(position);
    
    // Store current location for next comparison
    prevLocation.current = userLocation;
    
  }, [userLocation, mapRef, userMarker]);
};
