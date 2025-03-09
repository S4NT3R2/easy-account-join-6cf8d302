
import { ArrowLeft, MapPin, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const addressTypes = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "office", label: "Office", icon: "🏢" },
  { id: "other", label: "Other", icon: "📍" },
];

// Use a valid Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyD3INX2lzW5Ua6r77kXZf8_xZjNZUq2I8A";

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }]
    }
  ]
};

const AddLocationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedType, setSelectedType] = useState("home");
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [locationCoords, setLocationCoords] = useState<[number, number]>([31.0335, -17.8292]); // Default to Harare
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  // Initialize geocoder when maps API is loaded
  useEffect(() => {
    if (isLoaded && !geocoder.current) {
      geocoder.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setLocationCoords([longitude, latitude]);
          
          // Reverse geocode to get address
          if (geocoder.current) {
            geocoder.current.geocode({ 
              location: { lat: latitude, lng: longitude } 
            }, (results, status) => {
              if (status === "OK" && results && results[0]) {
                setAddress(results[0].formatted_address);
              }
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error(`Could not get your location: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [isLoaded]);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Create a marker
    markerRef.current = new google.maps.Marker({
      position: { lat: locationCoords[1], lng: locationCoords[0] },
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Drag to set exact location'
    });
    
    // Set up marker drag event
    markerRef.current.addListener('dragend', () => {
      const position = markerRef.current?.getPosition();
      if (position) {
        setLocationCoords([position.lng(), position.lat()]);
        
        // Reverse geocode to get address
        if (geocoder.current) {
          geocoder.current.geocode({ 
            location: { lat: position.lat(), lng: position.lng() } 
          }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        }
      }
    });
  };

  const handleSearch = () => {
    if (!searchQuery.trim() || !geocoder.current) return;
    
    geocoder.current.geocode({ address: searchQuery }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        setLocationCoords([location.lng(), location.lat()]);
        setAddress(results[0].formatted_address);
        
        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(15);
        }
        
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        }
      } else {
        toast.error('No locations found for your search');
      }
    });
  };

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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] p-4 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-white">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      {/* Map Container */}
      <div className="relative h-[55vh]">
        <div className="absolute inset-0">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: locationCoords[1], lng: locationCoords[0] }}
            zoom={14}
            options={mapOptions}
            onLoad={onMapLoad}
          />
        </div>
        
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search Location"
              className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#232836] text-white border border-gray-700/50 focus:border-primary transition-colors text-sm"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
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
