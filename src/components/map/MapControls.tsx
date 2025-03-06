
import React from 'react';
import mapboxgl from 'mapbox-gl';

interface AddMapControlsProps {
  map: mapboxgl.Map;
}

export const addMapControls = ({ map }: AddMapControlsProps): void => {
  // Add location control
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }),
    'top-right'
  );
  
  // Add navigation controls
  map.addControl(
    new mapboxgl.NavigationControl(),
    'top-right'
  );
};
