
import { ServiceProvider } from "./service.types";

export interface ProviderService {
  id: string;
  provider_id: string;
  name: string;
  description?: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProviderLocation {
  longitude: number;
  latitude: number;
  address: string;
}

// Add is_active property to match database schema
export interface ExtendedServiceProvider extends ServiceProvider {
  is_active: boolean;
}
