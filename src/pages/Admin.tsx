
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Car, ServiceProvider, Service } from '@/types/service.types';
import { mockServiceProviders, mockCars, mockServices } from '@/data/mockData';
import { Pencil, Trash, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>(mockServiceProviders);
  const [cars, setCars] = useState<Car[]>(mockCars);
  const [services, setServices] = useState<Service[]>(mockServices);
  const [activeTab, setActiveTab] = useState("providers");

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter(provider => provider.id !== providerId));
    toast.success("Service provider deleted successfully");
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter(car => car.id !== carId));
    toast.success("Car deleted successfully");
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast.success("Service deleted successfully");
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
            <div className="grid gap-4">
              {providers.map(provider => (
                <div 
                  key={provider.id} 
                  className="bg-[#232836] p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={provider.image} 
                      alt={provider.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{provider.name}</h3>
                      <p className="text-sm text-gray-400">{provider.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline">
                      <Pencil className="h-4 w-4" />
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
              ))}
            </div>
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
                      alt={car.make} 
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{car.year} {car.make} {car.model}</h3>
                      <p className="text-sm text-gray-400">{car.licensePlate}</p>
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
              <h2 className="text-xl font-medium">Manage Services</h2>
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
