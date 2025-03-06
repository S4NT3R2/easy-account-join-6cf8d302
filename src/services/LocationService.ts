
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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        resolve({
          coords: [longitude, latitude],
          error: null
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        const errorMessage = `Error getting location: ${error.message}`;
        toast.error(`Could not access your location: ${error.message}`);
        
        // Default to Harare if location access fails
        resolve({
          coords: [31.0335, -17.8292],
          error: errorMessage
        });
      },
      { enableHighAccuracy: true }
    );
  });
};

export const watchPosition = (
  onPositionUpdate: (position: [number, number]) => void,
  onError: (error: string) => void
): number => {
  return navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords;
      onPositionUpdate([longitude, latitude]);
    },
    (error) => {
      console.error('Error watching position:', error);
      onError(`Error watching position: ${error.message}`);
    },
    { enableHighAccuracy: true }
  );
};

export const clearWatch = (watchId: number): void => {
  navigator.geolocation.clearWatch(watchId);
};
