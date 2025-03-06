
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseUserLocationTrackingProps {
  map: React.RefObject<mapboxgl.Map | null>;
  userMarker: React.RefObject<mapboxgl.Marker | null>;
  userLocation: [number, number] | null;
}

export const useUserLocationTracking = ({
  map,
  userMarker,
  userLocation
}: UseUserLocationTrackingProps): void => {
  // Update map when user location changes
  useEffect(() => {
    if (map.current && userLocation && userMarker.current) {
      // Update user marker position
      userMarker.current.setLngLat(userLocation);
    }
  }, [userLocation, map, userMarker]);
};
