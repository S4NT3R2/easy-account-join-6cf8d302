
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

interface LocationSearchProps {
  map: React.RefObject<mapboxgl.Map | null>;
  mapInitialized: boolean;
  onLocationSelect: (coords: [number, number]) => void;
  onClose: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  map, 
  mapInitialized, 
  onLocationSelect,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchLocations = async () => {
    if (!query.trim() || !mapboxgl.accessToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&limit=5`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data.features);
    } catch (error) {
      console.error('Error searching for location:', error);
      toast.error('Failed to search for locations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchLocations();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectLocation = (feature: any) => {
    const [lng, lat] = feature.center;
    onLocationSelect([lng, lat]);
    
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 13,
        duration: 1500
      });
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
              results.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleSelectLocation(feature)}
                  className="w-full p-4 rounded-lg bg-[#232836] hover:bg-[#2c3143] transition-colors text-left"
                >
                  <h3 className="text-white font-medium">{feature.text}</h3>
                  <p className="text-gray-400 text-sm">{feature.place_name}</p>
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
