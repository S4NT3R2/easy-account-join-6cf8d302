
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const addressTypes = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "office", label: "Office", icon: "🏢" },
  { id: "other", label: "Other", icon: "📍" },
];

const AddLocationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedType, setSelectedType] = useState("home");
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [-92.5, 39.7], // Centered on Missouri (approximately)
        zoom: 7,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      
      setIsMapInitialized(true);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        setIsMapInitialized(false);
      }
    };
  }, [mapboxToken, isMapInitialized]);

  const saveAddress = async () => {
    if (!user) {
      toast.error("You must be logged in to save an address");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter an address");
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          type: selectedType,
          address: address.trim()
        });

      if (error) throw error;

      toast.success("Address saved successfully");
      navigate("/addresses");
    } catch (error: any) {
      toast.error("Failed to save address: " + error.message);
      console.error("Error saving address:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          <h2 className="text-xl text-white text-center mb-4">Enter Mapbox Token</h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            To use the map feature, please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
          </p>
          <input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox public token"
            className="w-full p-4 rounded-xl bg-[#232836] text-white border border-gray-700/50 focus:border-primary transition-colors text-sm"
          />
          <p className="text-xs text-gray-500 text-center">
            Visit <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a> to get your token
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="relative h-[55vh]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <Link 
            to="/addresses" 
            className="text-white hover:text-primary/80 flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-sm">Cancel</span>
          </Link>
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
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#232836] text-white border border-gray-700/50 focus:border-primary transition-colors text-sm"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2">
              <MapPin className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative -mt-8 rounded-t-[2rem] bg-[#1A1F2C] p-6 z-20 shadow-xl border-t border-gray-800">
        <div className="space-y-6">
          {/* Address Type Selection */}
          <div>
            <h3 className="text-sm text-gray-400 mb-3">Select Address type</h3>
            <div className="flex gap-3">
              {addressTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex-1 p-4 rounded-xl flex flex-col items-center gap-2 border transition-all ${
                    selectedType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700/50 hover:border-primary/50"
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
              className="w-full p-4 rounded-xl bg-[#232836] text-white border border-gray-700/50 focus:border-primary transition-colors min-h-[100px] resize-none text-sm"
            />
          </div>

          {/* Save Button */}
          <button 
            onClick={saveAddress}
            disabled={isSaving}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Saving...
              </span>
            ) : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationPage;
