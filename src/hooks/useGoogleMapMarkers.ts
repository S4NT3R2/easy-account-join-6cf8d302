
import { useEffect } from 'react';
import { ServiceProvider } from '@/types/service.types';

interface UseGoogleMapMarkersProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  markers: React.MutableRefObject<google.maps.Marker[]>;
  serviceProviders: ServiceProvider[];
  mapInitialized: boolean;
  setSelectedProvider: (provider: ServiceProvider | null) => void;
}

export const useGoogleMapMarkers = ({
  mapRef,
  markers,
  serviceProviders,
  mapInitialized,
  setSelectedProvider
}: UseGoogleMapMarkersProps): void => {
  
  // Update service provider markers
  const updateServiceProviderMarkers = () => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    
    // Add new markers for service providers
    serviceProviders.forEach((provider) => {
      const position = { lat: provider.location[1], lng: provider.location[0] };
      
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current,
        title: provider.name,
        icon: {
          url: provider.image,
          scaledSize: new google.maps.Size(40, 40),
        }
      });
      
      marker.addListener('click', () => {
        setSelectedProvider(provider);
      });
      
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
