import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { addMapControls } from '@/components/map/MapControls';
import { createUserMarker } from '@/components/map/MapMarker';
import { ServiceProvider } from '@/types/service.types';
import { watchPosition, clearWatch, getCurrentLocation } from '@/services/LocationService';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const styleElement = useRef<HTMLStyleElement | null>(null);
  const watchId = useRef<number | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | undefined>(initialToken);
  const [isTokenRequired, setIsTokenRequired] = useState(false);
  const isManualLocationRequest = useRef<boolean>(false);

  const clearExistingMap = () => {
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    if (userMarker.current) {
      userMarker.current = null;
    }
    
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    if (watchId.current !== null) {
      clearWatch(watchId.current);
      watchId.current = null;
    }
    
    setMapInitialized(false);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      mapboxgl.accessToken = savedToken;
      setMapboxToken(savedToken);
    } else if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      localStorage.setItem('mapbox_token', mapboxToken);
    } else {
      setIsTokenRequired(true);
      return;
    }
    
    const validateToken = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/harare.json?access_token=${mapboxgl.accessToken}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Invalid token');
        }
        
        setIsTokenRequired(false);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsTokenRequired(true);
        toast.error('Invalid Mapbox token. Please provide a valid token.');
        localStorage.removeItem('mapbox_token');
      }
    };
    
    validateToken();
  }, [mapboxToken]);

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

  useEffect(() => {
    if (!mapContainer.current || mapInitialized || !mapboxgl.accessToken || isTokenRequired) return;
    
    clearExistingMap();
    
    try {
      getCurrentLocation().then(({ coords, error }) => {
        setUserLocation(coords);
        setLocationError(error);
        
        const initialLocation = coords || [31.0335, -17.8292];
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: initialLocation,
          zoom: 13,
          dragRotate: false,
          pitchWithRotate: false,
          trackResize: true,
          renderWorldCopies: true
        });

        map.current.on('load', () => {
          if (!map.current) return;
          setMapInitialized(true);
          
          addMapControls({ map: map.current });
          
          if (coords) {
            userMarker.current = createUserMarker(coords, map.current);
          }
        });

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
        clearExistingMap();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLocationError(`Could not load the map: ${errorMessage}`);
    }
  }, [mapInitialized, setUserLocation, setLocationError, mapboxToken, isTokenRequired]);

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
