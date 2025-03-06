
import React from 'react';
import { Navigation2 } from 'lucide-react';
import { ServiceProvider } from "@/types/service.types";
import { calculateDistance, formatDistance } from '@/utils/distanceUtils';

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onBookNow: () => void;
  userLocation?: [number, number] | null;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ 
  provider, 
  onBookNow,
  userLocation 
}) => {
  // Calculate real distance if user location is available
  const distanceText = userLocation 
    ? formatDistance(calculateDistance(
        userLocation[1], // latitude
        userLocation[0], // longitude
        provider.location[1], // provider latitude
        provider.location[0]  // provider longitude
      ))
    : provider.distance; // Fallback to the static distance

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#232836]/95 backdrop-blur-sm p-4 rounded-xl shadow-lg w-80">
      <div className="flex items-start gap-4">
        <img 
          src={provider.image} 
          alt={provider.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">{provider.name}</h3>
            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">
              {provider.rating} ★
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-1">{provider.address}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Navigation2 className="w-4 h-4" />
              {distanceText}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              ${provider.cost}
            </div>
          </div>
          <button 
            onClick={onBookNow}
            className="w-full mt-3 bg-primary text-background font-medium py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderCard;
