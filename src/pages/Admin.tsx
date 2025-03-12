
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Car, ServiceProvider, Service } from '@/types/service.types';
import { ProviderService, ExtendedServiceProvider } from '@/types/provider.types';
import { 
  Pencil, Trash, Plus, ArrowLeft, Wrench, 
  Car as CarIcon, Settings, Power, MapPin 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Mock cars and services since they're not exported from mockData
const mockCars: Car[] = [
  {
    id: "car1",
    userId: "user1",
    name: "Toyota Camry",
    image: "/lovable-uploads/797bf7f3-5624-4894-80ae-3056c954c808.png",
    plateNumber: "ABC 123",
    year: "2020",
    make: "Toyota",
    model: "Camry"
  },
  {
    id: "car2",
    userId: "user1",
    name: "Honda Civic",
    image: "/lovable-uploads/797bf7f3-5624-4894-80ae-3056c954c808.png",
    plateNumber: "XYZ 789",
    year: "2019",
    make: "Honda",
    model: "Civic"
  }
];

// Mock services
const mockServices: Service[] = [
  {
    id: "service1",
    name: "Basic Wash",
    description: "Exterior wash and windows cleaning",
    price: 25,
    icon: CarIcon
  },
  {
    id: "service2",
    name: "Premium Wash",
    description: "Exterior wash, interior cleaning, and waxing",
    price: 45,
    icon: Wrench
  },
  {
    id: "service3",
    name: "Full Detail",
    description: "Complete interior and exterior detailing",
    price: 120,
    icon: Settings
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [providers, setProviders] = useState<ExtendedServiceProvider[]>([]);
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [activeTab, setActiveTab] = useState("providers");
  const [loading, setLoading] = useState(true);
  const [providerServices, setProviderServices] = useState<Record<string, ProviderService[]>>({});

  // Fetch service providers and their services
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        
        // Fetch all service providers
        const { data: providersData, error: providersError } = await supabase
          .from('service_providers')
          .select('*');
          
        if (providersError) throw providersError;
        
        if (providersData) {
          // Convert to ExtendedServiceProvider format
          const formattedProviders: ExtendedServiceProvider[] = providersData.map(provider => ({
            id: provider.id,
            name: provider.name,
            address: provider.address,
            rating: Number(provider.rating),
            distance: "0.5 miles", // Placeholder
            cost: Number(provider.cost),
            image: provider.image || "/lovable-uploads/abb66627-cad4-4c4f-8531-2210017f4336.png",
            location: provider.location,
            is_active: provider.is_active ?? true
          }));
          
          setProviders(formattedProviders);
          
          // Fetch services for each provider
          for (const provider of formattedProviders) {
            const { data: serviceData, error: serviceError } = await supabase
              .from('provider_services')
              .select('*')
              .eq('provider_id', provider.id);
              
            if (serviceError) throw serviceError;
            
            setProviderServices(prev => ({
              ...prev,
              [provider.id]: serviceData || []
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast.error('Failed to load service providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleDeleteProvider = async (providerId: string) => {
    if (!confirm('Are you sure you want to delete this service provider?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', providerId);
        
      if (error) throw error;
      
      setProviders(providers.filter(provider => provider.id !== providerId));
      toast.success("Service provider deleted successfully");
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast.error('Failed to delete service provider');
    }
  };

  const handleToggleProviderStatus = async (providerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_active: !currentStatus })
        .eq('id', providerId);
        
      if (error) throw error;
      
      setProviders(providers.map(provider => 
        provider.id === providerId 
          ? { ...provider, is_active: !currentStatus } 
          : provider
      ));
      
      toast.success(`Provider ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling provider status:', error);
      toast.error('Failed to update provider status');
    }
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter(car => car.id !== carId));
    toast.success("Car deleted successfully");
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast.success("Service deleted successfully");
  };

  const handleDeleteProviderService = async (serviceId: string, providerId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('provider_services')
        .delete()
        .eq('id', serviceId);
        
      if (error) throw error;
      
      setProviderServices(prev => ({
        ...prev,
        [providerId]: prev[providerId].filter(service => service.id !== serviceId)
      }));
      
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleEditProviderService = (serviceId: string, providerId: string) => {
    navigate(`/provider/edit-service/${serviceId}?providerId=${providerId}`);
  };

  const handleAddProviderService = (providerId: string) => {
    navigate(`/provider/add-service/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/home')}
              className="text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-[#232836]">
            <TabsTrigger value="providers" className="data-[state=active]:bg-primary">Service Providers</TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-primary">Cars</TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-primary">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Service Providers</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Provider
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {providers.map(provider => (
                  <div 
                    key={provider.id} 
                    className="bg-[#232836] p-4 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={provider.image} 
                          alt={provider.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium">{provider.name}</h3>
                          <div className="flex items-center text-sm text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {provider.address}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant={provider.is_active ? "outline" : "default"}
                          onClick={() => handleToggleProviderStatus(provider.id, provider.is_active)}
                          className={provider.is_active ? "text-red-400 hover:text-red-300" : "bg-green-600 hover:bg-green-700"}
                        >
                          <Power className="h-4 w-4 mr-1" />
                          {provider.is_active ? "Disable" : "Enable"}
                        </Button>
                        <Button 
                          size="icon" 
                          variant="destructive"
                          onClick={() => handleDeleteProvider(provider.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Provider Services List */}
                    <div className="border-t border-gray-700 pt-3 mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-primary">Services</h4>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleAddProviderService(provider.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Service
                        </Button>
                      </div>
                      
                      <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-2">
                        {providerServices[provider.id]?.length > 0 ? (
                          providerServices[provider.id].map(service => (
                            <div 
                              key={service.id} 
                              className="flex justify-between items-center p-2 bg-[#1A1F2C] rounded"
                            >
                              <div>
                                <div className="font-medium text-sm">{service.name}</div>
                                <div className="text-xs text-primary">${Number(service.price).toFixed(2)}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8"
                                  onClick={() => handleEditProviderService(service.id, provider.id)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-8 w-8 text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteProviderService(service.id, provider.id)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-sm text-gray-400 py-2">
                            No services added yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {providers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No service providers found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cars" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Cars</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Car
              </Button>
            </div>
            <div className="grid gap-4">
              {cars.map(car => (
                <div 
                  key={car.id} 
                  className="bg-[#232836] p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={car.image} 
                      alt={car.name} 
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{car.make && car.model ? `${car.year} ${car.make} ${car.model}` : car.name}</h3>
                      <p className="text-sm text-gray-400">{car.plateNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => handleDeleteCar(car.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Global Services</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Service
              </Button>
            </div>
            <div className="grid gap-4">
              {services.map(service => (
                <div 
                  key={service.id} 
                  className="bg-[#232836] p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-400">${service.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
