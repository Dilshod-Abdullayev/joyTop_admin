// Statistics API Types

export interface PaymentStats {
  total_users_paid: number;
  total_payments: number;
  total_amount: string; // decimal format
  top_categories?: Array<{
    category__ru: string;
    total: number;
  }>;
  total_categories_amount?: string;
  top_users?: Array<{
    user__name: string;
    user__phone: string;
    total: number;
  }>;
}

export interface GeneralStats {
  // Based on API documentation, this endpoint exists but response schema is not defined
  // We'll define common general statistics fields
  total_users?: number;
  total_listings?: number;
  total_views?: number;
  total_favorites?: number;
  total_chats?: number;
  active_listings?: number;
  promoted_listings?: number;
  new_users_today?: number;
  new_users_this_month?: number;
  new_listings_today?: number;
  new_listings_this_month?: number;
}

export interface TariffStats {
  // Based on API documentation, this endpoint exists but response schema is not defined
  // We'll define common tariff statistics fields
  total_subscriptions?: number;
  active_subscriptions?: number;
  expiring_subscriptions?: number;
  revenue_by_tariff?: Array<{
    tariff_name: string;
    count: number;
    revenue: string;
  }>;
  subscription_distribution?: Array<{
    tariff_name: string;
    count: number;
    percentage: number;
  }>;
}

export interface StatisticsFilters {
  date_from?: string;
  date_to?: string;
  period?: "day" | "week" | "month" | "year";
}

// API Response wrappers
export interface StatisticsResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedStatisticsResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
