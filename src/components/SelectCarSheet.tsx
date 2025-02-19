
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
    image: "/lovable-uploads/9a030240-7a51-49e2-8295-cdf1ca33a28d.png",
  },
  {
    id: "2",
    name: "BMW M4",
    plateNumber: "MYS 5521",
    image: "/lovable-uploads/9c086826-9d2f-481c-818b-1f3d53deb170.png",
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
              className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                selectedCar?.id === car.id
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/30 border-border"
              } border`}
            >
              <img src={car.image} alt={car.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">{car.name}</div>
                <div className="text-xs text-muted-foreground">{car.plateNumber}</div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedCar?.id === car.id
                    ? "border-primary bg-primary"
                    : "border-border"
                } flex items-center justify-center`}
              >
                {selectedCar?.id === car.id && (
                  <div className="w-3 h-3 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
          <button className="w-full flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary transition-all">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">Add a new car</div>
              <div className="text-xs text-muted-foreground">Tap to add</div>
            </div>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
