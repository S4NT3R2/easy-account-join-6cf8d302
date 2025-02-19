
import { useState } from "react";
import { Car, Calendar, Settings, Search, MapPin } from "lucide-react";
import { format } from "date-fns";
import { SelectCarSheet } from "@/components/SelectCarSheet";
import { ServicesSheet } from "@/components/ServicesSheet";
import { DateTimeSheet } from "@/components/DateTimeSheet";

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
  
  // Selection state
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="flex-1 relative bg-[#1A1F2C]" />

      <div className="bg-[#1A1F2C]/95 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <button
              onClick={() => setSelectCarOpen(true)}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className={`w-12 h-12 rounded-full ${selectedCar ? 'bg-primary' : 'bg-muted/30'} flex items-center justify-center`}>
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">
                {selectedCar?.name?.split(' ')[0] || "Select Car"}
              </span>
            </button>

            <button
              onClick={() => setServicesOpen(true)}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className={`w-12 h-12 rounded-full ${selectedService ? 'bg-primary' : 'bg-muted/30'} flex items-center justify-center`}>
                <Settings className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{selectedService?.name || "Services"}</span>
            </button>

            <button
              onClick={() => setDateTimeOpen(true)}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <div className={`w-12 h-12 rounded-full ${selectedDateTime ? 'bg-primary' : 'bg-muted/30'} flex items-center justify-center`}>
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">
                {selectedDateTime ? format(selectedDateTime, "d MMM, HH:mm") : "When?"}
              </span>
            </button>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-4 pr-12">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Service Location</div>
                <div className="text-sm text-foreground">{location}</div>
              </div>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <Search className="w-5 h-5" />
              </button>
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
    </div>
  );
};

export default Home;
