
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface LocationSearchProps {
  map: React.RefObject<mapboxgl.Map | null> | React.RefObject<google.maps.Map | null>;
  mapInitialized: boolean;
  onLocationSelect: (coords: [number, number]) => void;
  onClose: () => void;
  isGoogleMaps?: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  map, 
  mapInitialized, 
  onLocationSelect,
  onClose,
  isGoogleMaps = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  // Initialize Google Maps Geocoder
  useEffect(() => {
    if (isGoogleMaps && window.google && window.google.maps) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isGoogleMaps]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchGoogleLocations = async () => {
    if (!query.trim() || !geocoderRef.current) return;
    
    setIsLoading(true);
    try {
      geocoderRef.current.geocode({ address: query }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          setResults(results);
        } else {
          setResults([]);
          toast.error('No locations found');
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error searching for location:', error);
      toast.error('Failed to search for locations');
      setIsLoading(false);
    }
  };

  // Handle search input changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() && isGoogleMaps) {
        searchGoogleLocations();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, isGoogleMaps]);

  const handleSelectLocation = (feature: any) => {
    if (isGoogleMaps) {
      const location = feature.geometry.location;
      const lng = location.lng();
      const lat = location.lat();
      onLocationSelect([lng, lat]);
    }
    
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-[#1A1F2C]/95 flex flex-col z-50">
      <div className="p-4 bg-[#232836] shadow-md">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a location..."
              className="bg-[#1A1F2C] w-full py-3 pl-10 pr-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="py-3 px-4 rounded-lg bg-[#1A1F2C] text-white"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {results.length > 0 ? (
              results.map((feature, index) => (
                <button
                  key={feature.place_id || index}
                  onClick={() => handleSelectLocation(feature)}
                  className="w-full p-4 rounded-lg bg-[#232836] hover:bg-[#2c3143] transition-colors text-left"
                >
                  <h3 className="text-white font-medium">
                    {feature.formatted_address}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.formatted_address}
                  </p>
                </button>
              ))
            ) : query.trim() ? (
              <div className="text-center p-8 text-gray-400">
                No results found
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;
