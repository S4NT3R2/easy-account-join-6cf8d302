
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { ServiceProvider } from '@/types/service.types';
import { createProviderMarker } from '@/components/map/MapMarker';

interface UseProviderMarkersProps {
  map: React.RefObject<mapboxgl.Map | null>;
  markers: React.MutableRefObject<mapboxgl.Marker[]>;
  serviceProviders: ServiceProvider[];
  mapInitialized: boolean;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
}

export const useProviderMarkers = ({
  map,
  markers,
  serviceProviders,
  mapInitialized,
  setSelectedProvider
}: UseProviderMarkersProps): void => {
  // Update service provider markers
  const updateServiceProviderMarkers = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for service providers
    serviceProviders.forEach((provider) => {
      const marker = createProviderMarker(
        provider, 
        map.current!, 
        setSelectedProvider
      );
      markers.current.push(marker);
    });
  };

  // Update markers when service providers change
  useEffect(() => {
    if (mapInitialized) {
      updateServiceProviderMarkers();
    }
  }, [serviceProviders, mapInitialized]);
};
