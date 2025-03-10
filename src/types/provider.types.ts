
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
