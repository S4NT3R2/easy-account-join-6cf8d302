
import { Car, Settings, Calendar, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";

interface Service {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

interface Car {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
}

const HomePage = () => {
  const [isSelectCarOpen, setIsSelectCarOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDateTimeOpen, setIsDateTimeOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <div className="relative h-screen w-full bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="absolute inset-0 bg-[#1A1F2C]">
        {/* Map placeholder - dark themed */}
        <div className="h-full w-full bg-[#1A1F2C] opacity-80">
          {/* Map with glowing point at Chillicothe */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Action Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent pt-20">
        <div className="glass-morphism mx-4 mb-4 rounded-2xl p-6 space-y-6 bg-[#232836]/90">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => setIsSelectCarOpen(true)} 
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Select Car</span>
              {selectedCar && (
                <span className="text-xs text-gray-400">{selectedCar.name}</span>
              )}
            </button>
            
            <button 
              onClick={() => setIsServicesOpen(true)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">Services</span>
              {selectedService && (
                <span className="text-xs text-gray-400">{selectedService.name}</span>
              )}
            </button>
            
            <button 
              onClick={() => setIsDateTimeOpen(true)}
              className="flex flex-col items-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#2A2F3C] flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-white">When?</span>
              {selectedDateTime && (
                <span className="text-xs text-gray-400">
                  {selectedDateTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </span>
              )}
            </button>
          </div>

          {/* Location Search */}
          <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#2A2F3C] hover:bg-[#2F3447] transition-colors">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-[#232836] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <span className="text-sm text-white block">Service Location</span>
                <span className="text-xs text-gray-400">104, Hilton Street, Chillicolate, USA</span>
              </div>
            </div>
            <Search className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Bottom Sheets */}
      <SelectCarSheet
        open={isSelectCarOpen}
        onOpenChange={setIsSelectCarOpen}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
      />

      <ServicesSheet
        open={isServicesOpen}
        onOpenChange={setIsServicesOpen}
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      <DateTimeSheet
        open={isDateTimeOpen}
        onOpenChange={setIsDateTimeOpen}
        selectedDateTime={selectedDateTime}
        onSelectDateTime={setSelectedDateTime}
      />
    </div>
  );
};

export default HomePage;
