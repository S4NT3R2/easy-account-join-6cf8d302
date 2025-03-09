
import { ArrowLeft, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const carBrands = ["Aston Martine", "BMW", "Mercedes", "Audi", "Porsche"];
const carTypes = ["Sedan", "SUV", "Convertible", "Coupe", "Hatchback"];

const AddCarPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [carName, setCarName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const saveCar = async () => {
    if (!user) {
      toast.error("You must be logged in to add a car");
      return;
    }

    if (!carName.trim()) {
      toast.error("Please enter a car name");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "/placeholder.svg";

      // Use placeholder images for different car brands if no image is provided
      if (!imageFile) {
        if (selectedBrand === "Aston Martine") {
          imageUrl = "/lovable-uploads/797bf7f3-5624-4894-80ae-3056c954c808.png";
        } else if (selectedBrand === "BMW") {
          imageUrl = "/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png";
        }
      }
      
      const { data, error } = await supabase
        .from('cars')
        .insert({
          user_id: user.id,
          name: carName.trim(),
          brand: selectedBrand,
          model: selectedModel,
          type: selectedType,
          plate_number: plateNumber,
          image: imageUrl
        })
        .select();

      if (error) throw error;

      toast.success("Car added successfully");
      navigate("/cars");
    } catch (error: any) {
      toast.error("Failed to add car: " + error.message);
      console.error("Error adding car:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/cars" className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Add car</h1>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Image Upload */}
        <label className="block w-full aspect-video rounded-xl bg-[#232836] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 hover:border-primary transition-colors cursor-pointer overflow-hidden">
          {imagePreview ? (
            <img src={imagePreview} alt="Car preview" className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-400">Upload car photo</p>
            </>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="hidden" 
          />
        </label>

        {/* Car Details */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Car Name</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="Enter car name"
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Select Car Brand</label>
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            >
              <option value="">Select brand</option>
              {carBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Select Car Model</label>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            >
              <option value="">Select model</option>
              <option value="Vanquish S">Vanquish S</option>
              <option value="M4">M4</option>
              <option value="C-Class">C-Class</option>
              <option value="A4">A4</option>
              <option value="911">911</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Select Car Type</label>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            >
              <option value="">Select type</option>
              {carTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Add Car Number</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder="Enter plate number"
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={saveCar}
          disabled={loading}
          className="w-full p-4 rounded-lg bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Saving...
            </span>
          ) : "Save Car info"}
        </button>
      </div>
    </div>
  );
};

export default AddCarPage;
