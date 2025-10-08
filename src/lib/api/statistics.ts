import {
  GeneralStats,
  PaymentStats,
  TariffStats,
  StatisticsFilters,
  StatisticsResponse,
} from "@/types/statistics";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const statisticsApi = {
  // Test if endpoints exist
  testEndpoints: async () => {
    const endpoints = [
      "/api/website/v1/stats/general/",
      "/api/website/v1/stats/payments/",
      "/api/website/v1/stats/tariffs/",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            lang: localStorage.getItem("i18nextLng") || "ru",
          },
        });
        console.log(
          `Testing ${endpoint}:`,
          response.status,
          response.statusText
        );
      } catch (error) {
        console.error(`Error testing ${endpoint}:`, error);
      }
    }
  },

  // Get general statistics
  getGeneralStats: async (
    filters: StatisticsFilters = {}
  ): Promise<GeneralStats> => {
    const searchParams = new URLSearchParams();

    if (filters.date_from) searchParams.append("date_from", filters.date_from);
    if (filters.date_to) searchParams.append("date_to", filters.date_to);
    if (filters.period) searchParams.append("period", filters.period);

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/website/v1/stats/general/${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching general stats from:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("General stats fetch failed:", response.status, errorData);
      console.error(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );
      throw new Error(
        `HTTP ${response.status}: Failed to fetch general statistics`
      );
    }

    const responseData = await response.json();
    console.log("General stats API response:", responseData);

    // Handle wrapped response format
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && typeof responseData === "object") {
      // Fallback: if response is already the stats object
      return responseData;
    } else if (
      responseData &&
      typeof responseData === "object" &&
      Object.keys(responseData).length === 0
    ) {
      // Handle empty response - return empty stats object
      console.log(
        "General stats API returned empty response, returning empty stats object"
      );
      return {};
    } else {
      console.error(
        "Unexpected general stats response structure:",
        responseData
      );
      // Instead of throwing error, return empty object for graceful handling
      console.warn(
        "Returning empty object for general stats due to unexpected response"
      );
      return {};
    }
  },

  // Get payment statistics
  getPaymentStats: async (
    filters: StatisticsFilters = {}
  ): Promise<PaymentStats> => {
    const searchParams = new URLSearchParams();

    if (filters.date_from) searchParams.append("date_from", filters.date_from);
    if (filters.date_to) searchParams.append("date_to", filters.date_to);
    if (filters.period) searchParams.append("period", filters.period);

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/website/v1/stats/payments/${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching payment stats from:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Payment stats fetch failed:", response.status, errorData);
      throw new Error(
        `HTTP ${response.status}: Failed to fetch payment statistics`
      );
    }

    const responseData = await response.json();
    console.log("Payment stats API response:", responseData);

    // Handle wrapped response format
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (
      responseData &&
      typeof responseData === "object" &&
      responseData.total_users_paid !== undefined
    ) {
      // Direct response format with payment stats
      return responseData;
    } else if (
      responseData &&
      typeof responseData === "object" &&
      Object.keys(responseData).length === 0
    ) {
      // Handle empty response - return empty stats object
      console.log(
        "Payment stats API returned empty response, returning empty stats object"
      );
      return {
        total_users_paid: 0,
        total_payments: 0,
        total_amount: "0.00",
      };
    } else {
      console.error(
        "Unexpected payment stats response structure:",
        responseData
      );
      // Instead of throwing error, return empty stats object for graceful handling
      console.warn(
        "Returning empty stats object for payment stats due to unexpected response"
      );
      return {
        total_users_paid: 0,
        total_payments: 0,
        total_amount: "0.00",
      };
    }
  },

  // Get tariff statistics
  getTariffStats: async (
    filters: StatisticsFilters = {}
  ): Promise<TariffStats> => {
    const searchParams = new URLSearchParams();

    if (filters.date_from) searchParams.append("date_from", filters.date_from);
    if (filters.date_to) searchParams.append("date_to", filters.date_to);
    if (filters.period) searchParams.append("period", filters.period);

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/api/website/v1/stats/tariffs/${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("Fetching tariff stats from:", url);

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Tariff stats fetch failed:", response.status, errorData);
      throw new Error(
        `HTTP ${response.status}: Failed to fetch tariff statistics`
      );
    }

    const responseData = await response.json();
    console.log("Tariff stats API response:", responseData);

    // Handle wrapped response format
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && typeof responseData === "object") {
      // Fallback: if response is already the stats object
      return responseData;
    } else if (
      responseData &&
      typeof responseData === "object" &&
      Object.keys(responseData).length === 0
    ) {
      // Handle empty response - return empty stats object
      console.log(
        "Tariff stats API returned empty response, returning empty stats object"
      );
      return {};
    } else {
      console.error(
        "Unexpected tariff stats response structure:",
        responseData
      );
      // Instead of throwing error, return empty object for graceful handling
      console.warn(
        "Returning empty object for tariff stats due to unexpected response"
      );
      return {};
    }
  },
};
