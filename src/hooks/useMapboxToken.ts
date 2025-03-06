
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

interface UseMapboxTokenResult {
  isTokenRequired: boolean;
  setMapboxToken: (token: string) => void;
}

export const useMapboxToken = (initialToken?: string): UseMapboxTokenResult => {
  const [mapboxToken, setMapboxToken] = useState<string | undefined>(initialToken);
  const [isTokenRequired, setIsTokenRequired] = useState(false);

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

  return {
    isTokenRequired,
    setMapboxToken
  };
};
