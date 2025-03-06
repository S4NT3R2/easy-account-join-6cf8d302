
import React from 'react';
import mapboxgl from 'mapbox-gl';
import { ServiceProvider } from "@/types/service.types";

interface MapMarkerProps {
  element: HTMLElement;
  lngLat: [number, number];
  map: mapboxgl.Map;
}

export const createUserMarker = (
  lngLat: [number, number],
  map: mapboxgl.Map
): mapboxgl.Marker => {
  const userEl = document.createElement('div');
  userEl.className = 'user-location-marker';
  userEl.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center pulse-animation">
      <div class="w-4 h-4 rounded-full bg-white"></div>
    </div>
  `;

  return new mapboxgl.Marker(userEl)
    .setLngLat(lngLat)
    .addTo(map);
};

export const createProviderMarker = (
  provider: ServiceProvider,
  map: mapboxgl.Map,
  onClick: (provider: ServiceProvider) => void
): mapboxgl.Marker => {
  const markerEl = document.createElement('div');
  markerEl.className = 'custom-marker';
  markerEl.innerHTML = `
    <div class="w-12 h-12 rounded-full bg-primary/10 backdrop-blur-sm p-2 cursor-pointer hover:scale-110 transition-transform">
      <img src="${provider.image}" class="w-full h-full object-cover rounded-full" alt="${provider.name}" />
    </div>
  `;
  
  markerEl.addEventListener('click', () => {
    onClick(provider);
  });

  return new mapboxgl.Marker(markerEl)
    .setLngLat(provider.location)
    .addTo(map);
};

export const addMapStyles = (): HTMLStyleElement => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }
    
    .pulse-animation {
      animation: pulse 2s infinite;
    }
  `;
  document.head.appendChild(style);
  return style;
};
