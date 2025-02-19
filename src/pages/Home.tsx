
import { useState } from "react";
import { Car, Calendar, Settings, Search, MapPin, Menu } from "lucide-react";
import { format } from "date-fns";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";
import { AppSidebar } from "@/components/AppSidebar";

interface Car {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

const Home = () => {
  const [location, setLocation] = useState("104, Hilton Street, Chillicolate, USA");
  
  // Sheets state
  const [selectCarOpen, setSelectCarOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [dateTimeOpen, setDateTimeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Selection state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Map Background with Overlay */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1F2C]/90">
          <div className="absolute inset-0 bg-[url('/lovable-uploads/75aaeeac-3b66-4d69-a8da-b12e9346e9c0.png')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2C] via-[#1A1F2C]/80 to-transparent" />
        </div>
        
        {/* Menu Button */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-background/20 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Title Section */}
        <div className="relative z-10 pt-8 px-4">
          <h1 className="text-2xl font-bold text-white text-center mb-2">Car Service</h1>
          <p className="text-muted-foreground text-center text-sm">Schedule your premium car service</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-20">
        <div className="bg-[#1A1F2C]/95 backdrop-blur-xl border-t border-border">
          <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
            {/* Selection Buttons */}
            <div className="grid grid-cols-3 gap-8">
              <button
                onClick={() => setSelectCarOpen(true)}
                className="flex flex-col items-center gap-2.5 text-muted-foreground hover:text-primary transition-all group"
              >
                <div className={`w-14 h-14 rounded-full ${
                  selectedCar ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted/30'
                } flex items-center justify-center transform transition-all duration-200 group-hover:scale-105`}>
                  <Car className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium">
                  {selectedCar?.name?.split(' ')[0] || "Select Car"}
                </span>
              </button>

              <button
                onClick={() => setServicesOpen(true)}
                className="flex flex-col items-center gap-2.5 text-muted-foreground hover:text-primary transition-all group"
              >
                <div className={`w-14 h-14 rounded-full ${
                  selectedService ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted/30'
                } flex items-center justify-center transform transition-all duration-200 group-hover:scale-105`}>
                  <Settings className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium">{selectedService?.name || "Services"}</span>
              </button>

              <button
                onClick={() => setDateTimeOpen(true)}
                className="flex flex-col items-center gap-2.5 text-muted-foreground hover:text-primary transition-all group"
              >
                <div className={`w-14 h-14 rounded-full ${
                  selectedDateTime ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted/30'
                } flex items-center justify-center transform transition-all duration-200 group-hover:scale-105`}>
                  <Calendar className="w-7 h-7" />
                </div>
                <span className="text-xs font-medium">
                  {selectedDateTime ? format(selectedDateTime, "d MMM, HH:mm") : "When?"}
                </span>
              </button>
            </div>

            {/* Location Section */}
            <div className="relative">
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-4 pr-12 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Service Location</div>
                  <div className="text-sm text-foreground font-medium">{location}</div>
                </div>
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SelectCarSheet
        open={selectCarOpen}
        onOpenChange={setSelectCarOpen}
        selectedCar={selectedCar}
        onSelectCar={setSelectedCar}
      />

      <ServicesSheet
        open={servicesOpen}
        onOpenChange={setServicesOpen}
        selectedService={selectedService}
        onSelectService={setSelectedService}
      />

      <DateTimeSheet
        open={dateTimeOpen}
        onOpenChange={setDateTimeOpen}
        selectedDateTime={selectedDateTime}
        onSelectDateTime={setSelectedDateTime}
      />

      <AppSidebar 
        open={sidebarOpen} 
        onOpenChange={setSidebarOpen}
      />
    </div>
  );
};

export default Home;
