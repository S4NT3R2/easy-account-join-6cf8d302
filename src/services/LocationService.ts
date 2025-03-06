
import { toast } from 'sonner';

interface LocationResult {
  coords: [number, number];
  error: string | null;
}

export const getCurrentLocation = async (): Promise<LocationResult> => {
  if (!navigator.geolocation) {
    const error = 'Geolocation is not supported by your browser';
    toast.error(error);
    return {
      coords: [31.0335, -17.8292], // Default to Harare
      error
    };
  }

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      toast.error('Location request timed out. Using default location.');
      resolve({
        coords: [31.0335, -17.8292], // Default to Harare if timeout
        error: 'Location request timed out'
      });
    }, 10000); // 10 second timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        const { longitude, latitude } = position.coords;
        console.log('Got location:', longitude, latitude);
        resolve({
          coords: [longitude, latitude],
          error: null
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        console.error('Error getting location:', error);
        const errorMessage = `Error getting location: ${error.message}`;
        toast.error(`Could not access your location: ${error.message}`);
        
        // Default to Harare if location access fails
        resolve({
          coords: [31.0335, -17.8292],
          error: errorMessage
        });
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 30000, // Accept positions that are up to 30 seconds old
        timeout: 10000 // Wait 10 seconds for a position
      }
    );
  });
};

export const watchPosition = (
  onPositionUpdate: (position: [number, number]) => void,
  onError: (error: string) => void
): number => {
  console.log('Starting location watching...');
  return navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      console.log('Location update:', longitude, latitude);
      onPositionUpdate([longitude, latitude]);
    },
    (error) => {
      console.error('Error watching position:', error);
      onError(`Error watching position: ${error.message}`);
    },
    { 
      enableHighAccuracy: true,
      maximumAge: 10000, // Accept positions that are up to 10 seconds old
      timeout: 8000
    }
  );
};

export const clearWatch = (watchId: number): void => {
  console.log('Clearing location watch:', watchId);
  navigator.geolocation.clearWatch(watchId);
};
