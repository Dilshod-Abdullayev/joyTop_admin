export interface PaymentStats {
  total_users_paid: number;
  total_payments: number;
  total_amount: string;
  top_categories: TopCategory[];
  total_categories_amount: string;
  top_users: TopUser[];
}

export interface TopCategory {
  category__ru: string;
  total: number;
}

export interface TopUser {
  user__name: string;
  user__phone: string;
  total: number;
}

export interface PaymentFilters {
  date_from?: string;
  date_to?: string;
  category?: string;
  user?: string;
  min_amount?: number;
  max_amount?: number;
}
