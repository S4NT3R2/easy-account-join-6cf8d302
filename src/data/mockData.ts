
import { ServiceProvider } from "../types/service.types";

// Zimbabwe-based service providers
export const mockServiceProviders: ServiceProvider[] = [
  {
    id: "1",
    name: "Premium Car Wash",
    address: "104, Harare Street, Zimbabwe",
    rating: 4.8,
    distance: "0.8 km",
    cost: 80,
    image: "/lovable-uploads/480bcf4d-f31d-4960-a1f6-2805e938dbe2.png",
    location: [31.0335, -17.8292], // Harare coordinates
  },
  {
    id: "2",
    name: "Deluxe Auto Care",
    address: "456 Bulawayo Ave, Zimbabwe",
    rating: 4.6,
    distance: "1.2 km",
    cost: 95,
    image: "/lovable-uploads/f5732ae3-9d0b-42e1-afd0-3ad757441eb7.png",
    location: [28.5833, -20.1500], // Bulawayo coordinates
  },
  {
    id: "3",
    name: "Elite Car Services",
    address: "789 Victoria Falls Road, Zimbabwe",
    rating: 4.9,
    distance: "1.5 km",
    cost: 120,
    image: "/lovable-uploads/1775f99c-0d21-45df-be77-82e3edd8658b.png",
    location: [25.8373, -17.9244], // Victoria Falls coordinates
  }
];
