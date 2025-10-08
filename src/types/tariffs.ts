export interface Tariff {
  id: number;
  name: string;
  price: {
    currency: string;
    amount: number;
  };
  description: string;
  duration_days: number;
  categories: Array<{
    id: number;
    name: string;
  }>;
  tariff: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TariffRequest {
  name: string;
  price: string;
  description: string;
  duration_days: number;
  categories: number[];
}

export interface TariffUpdateRequest {
  name?: string;
  price?: string;
  description?: string;
  duration_days?: number;
  categories?: number[];
}

export interface TariffStats {
  tariff_name: string;
  users_count: number;
  total_amount: string;
}

export interface TariffFilters {
  search?: string;
  min_price?: number;
  max_price?: number;
  min_duration?: number;
  max_duration?: number;
  category?: number;
  page?: number;
  page_size?: number;
}
