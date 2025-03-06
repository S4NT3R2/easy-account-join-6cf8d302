
export interface Service {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
}

export interface Car {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
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
