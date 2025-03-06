
import React from 'react';
import { Car, Settings, Calendar, MapPin, Search } from 'lucide-react';

interface BottomNavigationProps {
  onSelectCarClick: () => void;
  onServicesClick: () => void;
  onDateTimeClick: () => void;
  onSearchClick: () => void;
  userLocation: [number, number] | null;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  onSelectCarClick,
  onServicesClick,
  onDateTimeClick,
  onSearchClick,
  userLocation
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent pt-16">
      <div className="mx-4 mb-8 space-y-6">
        <div className="grid grid-cols-3 gap-8">
          <button 
            onClick={onSelectCarClick} 
            className="flex flex-col items-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
              <Car className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-base text-white font-normal">Select Car</span>
          </button>
          
          <button 
            onClick={onServicesClick}
            className="flex flex-col items-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
              <Settings className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-base text-white font-normal">Services</span>
          </button>
          
          <button 
            onClick={onDateTimeClick}
            className="flex flex-col items-center space-y-3"
          >
            <div className="w-16 h-16 rounded-full bg-[#232836] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-primary" strokeWidth={1.5} />
            </div>
            <span className="text-base text-white font-normal">When?</span>
          </button>
        </div>

        <div className="bg-[#232836] rounded-2xl p-4">
          <button 
            onClick={onSearchClick}
            className="flex items-center gap-4 w-full"
          >
            <div className="w-12 h-12 rounded-full bg-[#1A1F2C] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-lg font-medium mb-1">Service Location</h3>
              <p className="text-gray-400">
                {userLocation ? "Using your current location" : "104, Harare Street, Zimbabwe"}
              </p>
            </div>
            <Search className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
