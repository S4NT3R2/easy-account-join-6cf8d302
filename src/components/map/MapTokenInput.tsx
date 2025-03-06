
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error('Please enter a valid Mapbox token');
      return;
    }

    localStorage.setItem('mapbox_token', token);
    onTokenSubmit(token);
    toast.success('Mapbox token saved successfully');
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
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#1eefac] to-[#1EAEDB] text-white"
          >
            Save Token
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MapTokenInput;
