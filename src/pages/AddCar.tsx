
import { ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const carBrands = ["Aston Martine", "BMW", "Mercedes", "Audi", "Porsche"];
const carTypes = ["Sedan", "SUV", "Convertible", "Coupe", "Hatchback"];

const AddCarPage = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

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
        <button className="w-full aspect-video rounded-xl bg-[#232836] flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-600 hover:border-primary transition-colors">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm text-gray-400">Upload car photo</p>
        </button>

        {/* Car Details */}
        <div className="space-y-4">
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
        <button className="w-full p-4 rounded-lg bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity">
          Save Car info
        </button>
      </div>
    </div>
  );
};

export default AddCarPage;
