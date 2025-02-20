
import { Car, Settings, Calendar, MapPin, Search } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative h-screen w-full bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="absolute inset-0 bg-[#1A1F2C]">
        {/* Map placeholder - dark themed */}
        <div className="h-full w-full bg-[#1A1F2C] opacity-80">
          {/* Add actual map implementation here */}
        </div>
      </div>

      {/* Bottom Action Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] to-transparent pt-20">
        <div className="glass-morphism mx-4 mb-4 rounded-xl p-6 space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Select Car</span>
            </button>
            
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Services</span>
            </button>
            
            <button className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">When?</span>
            </button>
          </div>

          {/* Location Search */}
          <button className="w-full flex items-center gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="text-left">
                <span className="text-sm text-white block">Service Location</span>
                <span className="text-xs text-gray-400">104, Hilton Street, Chillicolate, USA</span>
              </div>
            </div>
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
