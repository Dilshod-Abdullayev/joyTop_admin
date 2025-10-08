export interface ChartPoint {
  date: string;
  total?: number;
  count?: number;
}

export interface TariffDistribution {
  name: string;
  count: number;
}

export interface DashboardData {
 
    user_count: number;
    new_users_month: number;
    listing_count: number;
    active_listing_count: number;
    promoted_listing_count: number;
    views_count: number;
    favorites_count: number;
    chats_count: number;
    avg_listing_price: number;
    total_subscriptions: number;
    new_subscriptions_month: number;
    expiring_subscriptions_3days: number;
    tariff_distribution: TariffDistribution[];
    total_revenue: number;
    monthly_revenue: number;
    failed_payments: number;
    revenue_chart: ChartPoint[];
    users_chart: ChartPoint[];
    subscriptions_chart: ChartPoint[];
    most_popular_category: string | null;
    most_active_user: string | null;
    top_viewed_listing: string | null;
    monthly_new_listings: number;
}
