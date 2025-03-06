
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
    <div class="relative">
      <div class="w-8 h-8 rounded-full bg-blue-500/20 absolute animate-ping"></div>
      <div class="w-8 h-8 rounded-full bg-blue-500/40 flex items-center justify-center z-10 relative">
        <div class="w-4 h-4 rounded-full bg-white"></div>
      </div>
    </div>
  `;

  return new mapboxgl.Marker({
    element: userEl,
    anchor: 'center',
    offset: [0, 0]
  })
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
        opacity: 0.6;
        transform: scale(0.8);
      }
      50% {
        opacity: 0.3;
        transform: scale(1.2);
      }
      100% {
        opacity: 0.6;
        transform: scale(0.8);
      }
    }
    
    .animate-ping {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;
  document.head.appendChild(style);
  return style;
};
