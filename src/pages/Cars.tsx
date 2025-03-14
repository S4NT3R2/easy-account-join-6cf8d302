
import { ArrowLeft, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Car } from "@/types/service.types";

const CarsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

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
      } catch (error: any) {
        toast.error("Failed to load cars: " + error.message);
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [user]);

  const handleDeleteCar = async (carId: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) {
        throw error;
      }

      setCars(cars.filter(car => car.id !== carId));
      toast.success("Car deleted successfully");
      setShowDeleteMenu(null);
    } catch (error: any) {
      toast.error("Failed to delete car: " + error.message);
      console.error("Error deleting car:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sticky top-0 z-10 bg-[#1A1F2C] py-2">
        <Link to="/home" className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">My Cars</h1>
      </div>

      {/* Car List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="flex justify-center py-8 col-span-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="py-8 text-center text-gray-400 col-span-full">
            <p>No cars added yet. Add your first car.</p>
          </div>
        ) : (
          cars.map((car) => (
            <div 
              key={car.id}
              className="relative rounded-xl overflow-hidden bg-[#232836] hover:ring-2 hover:ring-primary/50 transition-all shadow-lg"
            >
              <img 
                src={car.image || "/placeholder.svg"} 
                alt={car.name} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{car.name}</h3>
                    <p className="text-sm text-gray-400">{car.brand || car.make}</p>
                    <p className="text-xs text-gray-500 mt-1">{car.plateNumber || car.plate_number}</p>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowDeleteMenu(showDeleteMenu === car.id ? null : car.id)}
                      className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-white" />
                    </button>
                    
                    {showDeleteMenu === car.id && (
                      <div className="absolute right-0 top-full mt-1 bg-[#2c3143] rounded-lg shadow-xl z-10 w-32 overflow-hidden">
                        <button 
                          onClick={() => handleDeleteCar(car.id)}
                          className="w-full text-left px-3 py-2 text-red-400 hover:bg-white/5 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Car Button */}
      <Link
        to="/cars/add"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
};

export default CarsPage;
