
import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const cars = [
  {
    id: "1",
    name: "Vanquish S",
    brand: "Aston Martine",
    plateNumber: "FYD 6778",
    image: "/lovable-uploads/797bf7f3-5624-4894-80ae-3056c954c808.png",
  },
  {
    id: "2",
    name: "BMW M4",
    brand: "BMW",
    plateNumber: "MYS 5521",
    image: "/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png",
  },
];

const CarsPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/home" className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">My cars</h1>
      </div>

      {/* Car List */}
      <div className="space-y-4">
        {cars.map((car) => (
          <div 
            key={car.id}
            className="relative rounded-xl overflow-hidden bg-[#232836] group hover:ring-2 hover:ring-primary/50 transition-all"
          >
            <img 
              src={car.image} 
              alt={car.name} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{car.name}</h3>
                  <p className="text-sm text-gray-400">{car.brand}</p>
                  <p className="text-xs text-gray-500 mt-1">{car.plateNumber}</p>
                </div>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
