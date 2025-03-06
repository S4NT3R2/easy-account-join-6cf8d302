
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateToken = async (tokenToValidate: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      // Try a simple API call to validate the token
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/harare.json?access_token=${tokenToValidate}&limit=1`
      );
      return response.ok;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error('Please enter a valid Mapbox token');
      return;
    }

    // Validate the token before saving
    setIsValidating(true);
    const isValid = await validateToken(token);
    
    if (isValid) {
      localStorage.setItem('mapbox_token', token);
      onTokenSubmit(token);
      toast.success('Mapbox token saved successfully');
    } else {
      toast.error('Invalid Mapbox token. Please check and try again.');
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#1A1F2C]/90 p-4 z-50">
      <div className="bg-[#232836] p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-2">Mapbox API Token Required</h2>
        <p className="text-gray-400 mb-6">
          To use the map functionality, please enter your Mapbox public token. 
          You can find it in your Mapbox account dashboard after signing up at mapbox.com.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox token"
            className="bg-[#1A1F2C] border-gray-700 text-white"
            disabled={isValidating}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Save Token'
            )}
          </Button>
          
          <div className="text-xs text-gray-400 mt-4">
            <p>Having trouble? Make sure to:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Use a public token (starts with 'pk')</li>
              <li>Check that your token has the right permissions</li>
              <li>Verify the token is active in your Mapbox account</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MapTokenInput;
