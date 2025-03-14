
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Car } from "@/types/service.types";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface SelectCarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCar: Car | null;
  onSelectCar: (car: Car) => void;
}

export function SelectCarSheet({ open, onOpenChange, selectedCar, onSelectCar }: SelectCarSheetProps) {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !open) return;

    const fetchCars = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setCars(data || []);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [user, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] bg-[#1A1F2C] border-t border-border p-0 rounded-t-2xl">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-white">Select Car</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">No cars found</p>
              <Link 
                to="/cars/add" 
                className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                onClick={() => onOpenChange(false)}
              >
                Add your first car
              </Link>
            </div>
          ) : (
            <>
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
                  <img src={car.image || "/placeholder.svg"} alt={car.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{car.name}</div>
                    <div className="text-xs text-muted-foreground">{car.plateNumber || car.plate_number}</div>
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
              <Link 
                to="/cars/add"
                onClick={() => onOpenChange(false)}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border hover:border-primary transition-all hover:scale-[1.02] group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white">Add a new car</div>
                  <div className="text-xs text-muted-foreground">Tap to add</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
