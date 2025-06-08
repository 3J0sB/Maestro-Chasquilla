export interface serviceRequest {
    id: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    providerId: string;
    consumerId: string;
    serviceId: string;
    service: service;
    user: user;
}

export interface service {
    id: string;
    title: string;
    price: number?;
    minServicePrice: number?;
    maxServicePrice: number?;
    description: string?;
    smallDescription: string?;
    serviceTag: string?;
    serviceTag2: string?;
    serviceTag3: string?;
    status: string?;
    image: string?;
    userId: string
    user: user;
    reviews: review[];
}

export interface user {
    id: string;
    name: string;
    lastName: string;
    lastName2: string;
    rut: string;
    email: string;
    emailVerified: boolean;
    image: string;
    locationId?: string;
    location?: location; // Relación con location
}

export interface review{
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    serviceId: string;
    userId: string;
    user: user;
}

export interface location {
  id: string;
  country: string;
  region: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Actualización de la interfaz serviceProvider para incluir la location
export interface serviceProvider {
  id: string;
  name: string;
  lastName: string;
  lastName2: string;
  about?: string;
  description?: string;
  rut: string;
  email: string;
  emailVerified: boolean;
  image: string;
  locationId?: string;
  location?: location; // Relación con location
  services: service[];
}