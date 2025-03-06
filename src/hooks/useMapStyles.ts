
import { useEffect, useRef } from 'react';
import { addMapStyles } from '@/components/map/MapMarker';

export const useMapStyles = (): void => {
  const styleElement = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // Add CSS for the pulse animation
    styleElement.current = addMapStyles();

    return () => {
      // Remove style element
      if (styleElement.current) {
        document.head.removeChild(styleElement.current);
      }
    };
  }, []);
};
