export interface Category {
  id: number;
  uz: string;
  ru: string;
  en: string;
  is_paid: boolean;
  ad_price: string;
}

export interface CategoryRequest {
  uz: string;
  ru: string;
  en: string;
  is_paid: boolean;
  ad_price: string;
}

export interface CategoryUpdateRequest {
  uz?: string;
  ru?: string;
  en?: string;
  is_paid?: boolean;
  ad_price?: string;
}

export interface CategoryWithCount extends Category {
  listing_count?: number;
}

export interface CategoryFilters {
  search?: string;
  is_paid?: boolean;
  ad_price?: string;
  min_price?: string;
  max_price?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
