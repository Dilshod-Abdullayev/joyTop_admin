export interface PropertyFilters {
  category?: number;
  city?: number;
  transaction_type?: string;
  price_min?: number;
  price_max?: number;
  rooms?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  photo: string | null;
  bio: string;
  role: string;
  status: string;
  language: string;
  contacts: {
    contact_phone: string;
    telegram: string;
    whatsapp: string;
  };
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: number;
  user_data: {
    id: number;
    name: string;
  };
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  price: {
    currency: string;
    amount: number;
  };
  transaction_type: string;
  specs?: {
    furnished: boolean;
    area: number;
    age: number;
    air_conditioning: boolean;
    parking: boolean;
    built_in_kitchen: boolean;
    elevator: boolean;
    security: boolean;
    living_area: number;
    lot_area: number;
    ceiling_height: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    toilets: number;
    balconies: number;
    floor: number;
    total_floors: number;
    renovation: string;
    heating: string;
    hot_water: string;
    energy_efficiency: string;
    noise_level: string;
    garage: boolean;
  };
  features: Array<{
    id: number;
    name: string;
  }>;
  mortgage_available?: boolean;
  nearby_list: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  status?: boolean;
  photos: string[];
  location: {
    city: string;
    district: string;
    building_number: string;
  };
  video?: string | null;
  types: {
    id: number;
    name: string;
  };
  view_count?: number;
  share_count?: number;
  favorite_count?: number;
  is_favorite: boolean;
  created_at: string;
}

export interface PaginatedPropertiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Property[];
}

// API Response wrapper
export interface PropertiesApiResponse {
  status: boolean;
  message: string;
  data: PaginatedPropertiesResponse;
}

// Single Property API Response
export interface SinglePropertyApiResponse {
  status: boolean;
  message: string;
  data: Property;
}
