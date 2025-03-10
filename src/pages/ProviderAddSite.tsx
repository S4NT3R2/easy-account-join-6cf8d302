
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Store, MapPin, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ProviderLocation } from "@/types/provider.types";
import GoogleMapComponent from "@/components/map/GoogleMapComponent";

const ProviderAddSite = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [baseCost, setBaseCost] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setImagePreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add a site");
      return;
    }
    
    if (!name || !address || !userLocation) {
      toast.error("Please fill in all required fields and select a location");
      return;
    }
    
    try {
      setLoading(true);
      
      let imagePath = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('provider-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('provider-images')
          .getPublicUrl(filePath);
          
        imagePath = publicURL.publicUrl;
      }
      
      // Insert provider data
      const { error: insertError } = await supabase
        .from('service_providers')
        .insert({
          user_id: user.id,
          name,
          address,
          cost: parseFloat(baseCost) || 0,
          image: imagePath,
          location: userLocation
        });
        
      if (insertError) throw insertError;
      
      toast.success("Service site added successfully");
      navigate('/provider/dashboard');
      
    } catch (error) {
      console.error('Error adding service site:', error);
      toast.error('Failed to add service site');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/provider/dashboard')}
          className="mb-6 text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-white mb-6">Add New Service Site</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#232836] border-0 shadow-lg text-white overflow-hidden">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#1A1F2C] border-0 text-white"
                      placeholder="Enter site name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-[#1A1F2C] border-0 text-white min-h-[80px]"
                        placeholder="Enter address"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 text-muted-foreground hover:text-white"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the map below to set your exact location
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="baseCost">Base Cost ($)</Label>
                    <Input
                      id="baseCost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={baseCost}
                      onChange={(e) => setBaseCost(e.target.value)}
                      className="bg-[#1A1F2C] border-0 text-white"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <Label>Upload Image</Label>
                    <div 
                      className="mt-1 flex justify-center rounded-lg border border-dashed border-muted-foreground/30 px-6 py-10 cursor-pointer hover:border-muted-foreground/50 bg-[#1A1F2C]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <div className="relative w-full h-40">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-full w-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2 text-center">
                          <Store className="mx-auto h-12 w-12 text-muted-foreground" />
                          <div className="text-sm text-muted-foreground">
                            <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                          </div>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-primary text-background font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                        Saving...
                      </span>
                    ) : "Add Site"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="h-[500px] bg-[#232836] rounded-lg overflow-hidden">
            <GoogleMapComponent
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              selectedProvider={null}
              setSelectedProvider={() => {}}
              serviceProviders={[]}
              setLocationError={setLocationError}
              isSearchOpen={isSearchOpen}
              onCloseSearch={() => setIsSearchOpen(false)}
            />
            
            {locationError && (
              <div className="p-2 text-center text-red-500 bg-red-500/10">
                {locationError}
              </div>
            )}
            
            {userLocation && (
              <div className="p-2 text-center text-green-500 bg-green-500/10">
                Location selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAddSite;
