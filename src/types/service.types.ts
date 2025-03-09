
import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  icon: LucideIcon;
}

export interface Car {
  id: string;
  userId?: string;
  name: string;
  make?: string;
  model?: string;
  year?: string;
  licensePlate?: string;
  image: string;
  plateNumber?: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  cost: number;
  image: string;
  location: [number, number];
}
