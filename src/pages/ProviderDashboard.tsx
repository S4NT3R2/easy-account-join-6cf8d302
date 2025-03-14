
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ServiceProvider } from "@/types/service.types";
import { ExtendedServiceProvider, ProviderService } from "@/types/provider.types";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MapPin, Store, Tag, Plus, Check, X, ArrowLeft, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<ExtendedServiceProvider[]>([]);
  const [services, setServices] = useState<Record<string, ProviderService[]>>({});

  // Fetch provider data
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('service_providers')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          // Convert to ExtendedServiceProvider format
          const providers = data.map(provider => ({
            id: provider.id,
            name: provider.name,
            address: provider.address,
            rating: Number(provider.rating),
            distance: "You own this",
            cost: Number(provider.cost),
            image: provider.image || "/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png",
            location: provider.location as [number, number],
            is_active: provider.is_active
          }));
          
          setProviderData(providers);
          
          // Fetch services for each provider
          for (const provider of providers) {
            const { data: serviceData, error: serviceError } = await supabase
              .from('provider_services')
              .select('*')
              .eq('provider_id', provider.id);
              
            if (serviceError) throw serviceError;
            
            setServices(prev => ({
              ...prev,
              [provider.id]: serviceData || []
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching provider data:', error);
        toast.error('Failed to load provider data');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [user]);

  const handleAddSite = () => {
    navigate('/provider/add-site');
  };

  const handleEditSite = (providerId: string) => {
    navigate(`/provider/edit-site/${providerId}`);
  };

  const handleDeleteSite = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this site? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', providerId);

      if (error) throw error;

      toast.success('Site deleted successfully');
      setProviderData(prevData => prevData.filter(provider => provider.id !== providerId));
    } catch (error) {
      console.error('Error deleting site:', error);
      toast.error('Failed to delete site');
    }
  };

  const handleAddService = (providerId: string) => {
    navigate(`/provider/add-service/${providerId}`);
  };

  const handleEditService = (serviceId: string, providerId: string) => {
    navigate(`/provider/edit-service/${serviceId}?providerId=${providerId}`);
  };

  const handleDeleteService = async (serviceId: string, providerId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('provider_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;

      toast.success('Service deleted successfully');
      setServices(prev => ({
        ...prev,
        [providerId]: prev[providerId].filter(service => service.id !== serviceId)
      }));
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const toggleSiteStatus = async (providerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_active: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;

      toast.success(`Site ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setProviderData(prevData => prevData.map(provider => 
        provider.id === providerId 
          ? { ...provider, is_active: !currentStatus }
          : provider
      ));
    } catch (error) {
      console.error('Error toggling site status:', error);
      toast.error('Failed to update site status');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] p-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6 sticky top-0 z-10 bg-[#1A1F2C] py-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-white ml-4">Service Provider Dashboard</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <Button 
              onClick={handleAddSite} 
              className="mb-6 bg-primary text-background font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Site
            </Button>

            {providerData.length === 0 ? (
              <Card className="bg-[#232836] border-0 shadow-lg text-white">
                <CardContent className="pt-6 pb-6 text-center">
                  <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg mb-4">You haven't added any service sites yet</p>
                  <Button 
                    onClick={handleAddSite} 
                    className="bg-primary text-background font-medium"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Site
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {providerData.map((provider) => (
                  <Card key={provider.id} className="bg-[#232836] border-0 shadow-lg text-white overflow-hidden hover:shadow-primary/20 transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{provider.name}</CardTitle>
                          <CardDescription className="text-muted-foreground mt-1 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {provider.address}
                          </CardDescription>
                        </div>
                        <div className={`flex items-center justify-center rounded-full h-8 w-8 ${provider.is_active ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {provider.is_active ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <Tabs defaultValue="services" className="w-full">
                      <TabsList className="w-full bg-[#1A1F2C] p-0">
                        <TabsTrigger 
                          value="services" 
                          className="flex-1 data-[state=active]:bg-[#2A2F3C] rounded-none"
                        >
                          Services
                        </TabsTrigger>
                        <TabsTrigger 
                          value="details" 
                          className="flex-1 data-[state=active]:bg-[#2A2F3C] rounded-none"
                        >
                          Details
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="services" className="p-4 mt-0">
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                          {services[provider.id]?.length > 0 ? (
                            services[provider.id].map(service => (
                              <div key={service.id} className="flex justify-between items-center p-3 bg-[#1A1F2C] rounded-lg hover:bg-[#1A1F2C]/70 transition-colors">
                                <div>
                                  <h4 className="font-medium">{service.name}</h4>
                                  <div className="flex items-center text-primary text-sm mt-1">
                                    <Tag className="h-4 w-4 mr-1" />
                                    ${Number(service.price).toFixed(2)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleEditService(service.id, provider.id)}
                                    className="h-8 w-8 rounded-full"
                                  >
                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleDeleteService(service.id, provider.id)}
                                    className="h-8 w-8 rounded-full text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted-foreground py-3">
                              No services added yet
                            </p>
                          )}
                          
                          <Button 
                            onClick={() => handleAddService(provider.id)} 
                            variant="outline" 
                            className="w-full mt-4 border-dashed border-muted-foreground/30 bg-transparent hover:bg-[#2A2F3C]"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details" className="p-4 mt-0">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Status:</p>
                            <span className={provider.is_active ? "text-green-500" : "text-red-500"}>
                              {provider.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Base cost:</p>
                            <span>${provider.cost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-muted-foreground">Rating:</p>
                            <span>{provider.rating.toFixed(1)} ★</span>
                          </div>
                          
                          <div className="flex gap-2 mt-6">
                            <Button 
                              variant="outline" 
                              onClick={() => toggleSiteStatus(provider.id, provider.is_active)}
                              className={`flex-1 ${provider.is_active ? 'hover:bg-red-500/10 hover:text-red-400' : 'hover:bg-green-500/10 hover:text-green-400'}`}
                            >
                              {provider.is_active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleEditSite(provider.id)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDeleteSite(provider.id)}
                              className="flex-1"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
