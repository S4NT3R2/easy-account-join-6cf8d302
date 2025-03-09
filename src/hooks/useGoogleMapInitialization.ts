
import { useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { ServiceProvider } from '@/types/service.types';

interface UseGoogleMapInitializationProps {
  userLocation: [number, number] | null;
  setUserLocation: (location: [number, number] | null) => void;
  setLocationError: (error: string | null) => void;
}

interface UseGoogleMapInitializationResult {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: React.RefObject<GoogleMap | null>;
  userMarker: React.MutableRefObject<google.maps.Marker | null>;
  markers: React.MutableRefObject<google.maps.Marker[]>;
  mapInitialized: boolean;
  getUserLocation: () => Promise<void>;
  isGoogleMapsLoaded: boolean;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true
};

// Harare, Zimbabwe as default location
const defaultCenter = { lat: -17.8292, lng: 31.0335 };

export const useGoogleMapInitialization = ({
  userLocation,
  setUserLocation,
  setLocationError
}: UseGoogleMapInitializationProps): UseGoogleMapInitializationResult => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const map = useRef<GoogleMap | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const userMarker = useRef<google.maps.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(true);

  const getUserLocation = async (): Promise<void> => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setLocationError(null);

          if (mapRef.current && userMarker.current) {
            const newPosition = { lat: latitude, lng: longitude };
            userMarker.current.setPosition(newPosition);
            mapRef.current.panTo(newPosition);
            mapRef.current.setZoom(14);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(`Error getting location: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const onMapLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
    setMapInitialized(true);

    // If userLocation exists, create a marker for it
    if (userLocation) {
      const position = { lat: userLocation[1], lng: userLocation[0] };
      
      if (!userMarker.current) {
        userMarker.current = new google.maps.Marker({
          position,
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 0.8,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
          },
          title: 'Your Location'
        });
      } else {
        userMarker.current.setPosition(position);
      }
      
      map.panTo(position);
      map.setZoom(14);
    } else {
      // Try to get user location if not provided
      getUserLocation();
    }
  };

  return {
    mapContainer,
    map,
    userMarker,
    markers,
    mapInitialized,
    getUserLocation,
    isGoogleMapsLoaded,
    mapRef
  };
};
