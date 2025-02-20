
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Car, Plus } from "lucide-react";

interface Car {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
  selected?: boolean;
}

interface SelectCarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCar: Car | null;
  onSelectCar: (car: Car) => void;
}

const cars: Car[] = [
  {
    id: "1",
    name: "Vanquish S Aston Martine",
    plateNumber: "FYD 6778",
    image: "/lovable-uploads/797bf7f3-5624-4894-80ae-3056c954c808.png",
  },
  {
    id: "2",
    name: "BMW M4",
    plateNumber: "MYS 5521",
    image: "/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png",
  },
];

export function SelectCarSheet({ open, onOpenChange, selectedCar, onSelectCar }: SelectCarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] bg-[#1A1F2C] border-t border-border p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-white">Select Car</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4">
          {cars.map((car) => (
            <button
              key={car.id}
              onClick={() => onSelectCar(car)}
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all hover:scale-[1.02] ${
                selectedCar?.id === car.id
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/30 border-border hover:border-primary"
              } border relative overflow-hidden group`}
            >
              <img src={car.image} alt={car.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">{car.name}</div>
                <div className="text-xs text-muted-foreground">{car.plateNumber}</div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                  selectedCar?.id === car.id
                    ? "border-primary bg-primary scale-110"
                    : "border-border"
                } flex items-center justify-center`}
              >
                {selectedCar?.id === car.id && (
                  <div className="w-3 h-3 rounded-full bg-white animate-fadeIn" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          ))}
          <button className="w-full flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary transition-all hover:scale-[1.02] group relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">Add a new car</div>
              <div className="text-xs text-muted-foreground">Tap to add</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
