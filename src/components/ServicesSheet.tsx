
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Car, Shell, Sparkles, Brush } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

interface ServicesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}

const services: Service[] = [
  {
    id: "bodywash",
    name: "Bodywash",
    price: 50,
    icon: <Car className="w-6 h-6" />,
  },
  {
    id: "interior",
    name: "Interior Cleaning",
    price: 70,
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "engine",
    name: "Engine detailing",
    price: 85,
    icon: <Shell className="w-6 h-6" />,
  },
  {
    id: "polish",
    name: "Car Polish",
    price: 45,
    icon: <Brush className="w-6 h-6" />,
  },
];

export function ServicesSheet({ open, onOpenChange, selectedService, onSelectService }: ServicesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] bg-[#1A1F2C] border-t border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-white">Services</SheetTitle>
        </SheetHeader>
        <div className="p-4 grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`flex flex-col items-center gap-2 p-6 rounded-lg transition-all hover:scale-105 animate-fadeIn ${
                selectedService?.id === service.id
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/30 border-border hover:border-primary"
              } border relative overflow-hidden`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedService?.id === service.id 
                    ? "bg-primary scale-110" 
                    : "bg-muted/30 hover:scale-105"
                }`}
              >
                <div className={`transition-colors duration-300 ${
                  selectedService?.id === service.id ? "text-secondary" : "text-primary"
                }`}>
                  {service.icon}
                </div>
              </div>
              <div className="text-sm font-medium text-white">{service.name}</div>
              <div className="text-xs text-muted-foreground">
                Approx ${service.price}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] animate-shimmer" />
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
