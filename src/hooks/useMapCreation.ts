
import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { addMapControls } from '@/components/map/MapControls';
import { toast } from 'sonner';

interface UseMapCreationProps {
  containerRef: React.RefObject<HTMLDivElement>;
  initialLocation: [number, number];
  isTokenRequired: boolean;
}

interface UseMapCreationResult {
  map: React.RefObject<mapboxgl.Map | null>;
  mapInitialized: boolean;
}

export const useMapCreation = ({
  containerRef,
  initialLocation,
  isTokenRequired
}: UseMapCreationProps): UseMapCreationResult => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapInitialized || !mapboxgl.accessToken || isTokenRequired) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: containerRef.current,
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
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Could not load the map: ${errorMessage}`);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    };
  }, [containerRef, mapInitialized, initialLocation, isTokenRequired]);

  return {
    map,
    mapInitialized
  };
};
