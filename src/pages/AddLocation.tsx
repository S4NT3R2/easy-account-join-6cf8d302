
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "YOUR_MAPBOX_TOKEN"; // Replace with your Mapbox token

const addressTypes = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "office", label: "Office", icon: "🏢" },
  { id: "other", label: "Other", icon: "📍" },
];

const AddLocationPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedType, setSelectedType] = useState("home");
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-92.5, 39.7], // Centered on Missouri (approximately)
      zoom: 7,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="relative h-[60vh]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Link 
            to="/addresses" 
            className="text-white hover:text-primary/80 flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Cancel</span>
          </Link>
          <button className="text-primary hover:text-primary/80">
            Continue
          </button>
        </div>

        {/* Search Bar */}
        <div className="absolute top-16 left-4 right-4 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Location"
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative -mt-6 rounded-t-[2rem] bg-[#1A1F2C] p-6 z-20">
        <div className="space-y-6">
          {/* Address Type Selection */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Select Address type</h3>
            <div className="flex gap-4">
              {addressTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700 hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm text-white">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Address Details */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Enter Address Details</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete address"
              className="w-full p-4 rounded-lg bg-[#232836] text-white border border-gray-700 focus:border-primary transition-colors min-h-[100px] resize-none"
            />
          </div>

          {/* Save Button */}
          <button className="w-full p-4 rounded-lg bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationPage;
