
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ProviderAddService = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [providerName, setProviderName] = useState("");

  // Verify provider exists and belongs to user
  useEffect(() => {
    const verifyProvider = async () => {
      if (!providerId || !user) return;

      try {
        setInitialLoading(true);
        const { data, error } = await supabase
          .from('service_providers')
          .select('name')
          .eq('id', providerId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProviderName(data.name);
        } else {
          throw new Error("Provider not found");
        }
      } catch (error) {
        console.error('Error verifying provider:', error);
        toast.error('Provider not found or access denied');
        navigate('/provider/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };

    verifyProvider();
  }, [providerId, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !providerId) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    
    if (!name || !price) {
      toast.error("Please enter a service name and price");
      return;
    }
    
    try {
      setLoading(true);
      
      // Add service
      const { error } = await supabase
        .from('provider_services')
        .insert({
          provider_id: providerId,
          name,
          description,
          price: parseFloat(price) || 0
        });
        
      if (error) throw error;
      
      toast.success("Service added successfully");
      navigate('/provider/dashboard');
      
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/provider/dashboard')}
          className="mb-6 text-muted-foreground hover:text-white"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-2xl font-bold text-white mb-2">Add New Service</h1>
        <p className="text-muted-foreground mb-6">
          Adding service to: <span className="text-primary">{providerName}</span>
        </p>
        
        <Card className="bg-[#232836] border-0 shadow-lg text-white overflow-hidden">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#1A1F2C] border-0 text-white"
                    placeholder="e.g. Car Wash, Oil Change, etc."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-[#1A1F2C] border-0 text-white min-h-[100px]"
                    placeholder="Describe what this service includes..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-[#1A1F2C] border-0 text-white pl-8"
                      placeholder="0.00"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-muted-foreground">$</span>
                    </div>
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
                      Adding...
                    </span>
                  ) : "Add Service"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderAddService;
