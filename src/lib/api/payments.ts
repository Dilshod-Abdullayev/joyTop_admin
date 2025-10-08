import { PaymentStats, PaymentFilters } from "@/types/payments";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const paymentsApi = {
  // Get payment statistics
  getPaymentStats: async (
    filters: PaymentFilters = {}
  ): Promise<PaymentStats> => {
    const searchParams = new URLSearchParams();

    if (filters.date_from) searchParams.append("date_from", filters.date_from);
    if (filters.date_to) searchParams.append("date_to", filters.date_to);
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.user) searchParams.append("user", filters.user);
    if (filters.min_amount)
      searchParams.append("min_amount", filters.min_amount.toString());
    if (filters.max_amount)
      searchParams.append("max_amount", filters.max_amount.toString());

    const response = await fetch(
      `${API_BASE}/api/website/v1/stats/payments/?${searchParams}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
    }

    return response.json();
  },
};
