import {
  Tariff,
  TariffRequest,
  TariffUpdateRequest,
  TariffFilters,
  TariffStats,
} from "@/types/tariffs";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const tariffsApi = {
  // Get all tariffs with optional filters
  getAll: async (filters: TariffFilters = {}): Promise<Tariff[]> => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.min_price)
      searchParams.append("min_price", filters.min_price.toString());
    if (filters.max_price)
      searchParams.append("max_price", filters.max_price.toString());
    if (filters.min_duration)
      searchParams.append("min_duration", filters.min_duration.toString());
    if (filters.max_duration)
      searchParams.append("max_duration", filters.max_duration.toString());
    if (filters.category)
      searchParams.append("category", filters.category.toString());
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());

    const response = await fetch(
      `${API_BASE}/api/website/v1/tariffs/?${searchParams}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tariffs: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle the wrapped response structure
    if (data && data.status === true && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn("Unexpected API response structure:", data);
      return [];
    }
  },

  // Get tariff by ID
  getTariff: async (id: number): Promise<Tariff> => {
    const response = await fetch(`${API_BASE}/api/website/v1/tariffs/${id}/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tariff: ${response.statusText}`);
    }

    return response.json();
  },

  // Create new tariff
  createTariff: async (data: TariffRequest): Promise<Tariff> => {
    const response = await fetch(`${API_BASE}/api/website/v1/tariffs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tariff creation failed:", response.status, errorText);
      throw new Error(`Failed to create tariff: ${response.statusText}`);
    }

    return response.json();
  },

  // Update tariff
  updateTariff: async (
    id: number,
    data: TariffUpdateRequest
  ): Promise<Tariff> => {
    const response = await fetch(`${API_BASE}/api/website/v1/tariffs/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tariff: ${response.statusText}`);
    }

    return response.json();
  },

  // Partial update tariff
  patchTariff: async (
    id: number,
    data: Partial<TariffUpdateRequest>
  ): Promise<Tariff> => {
    const response = await fetch(`${API_BASE}/api/website/v1/tariffs/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update tariff: ${response.statusText}`);
    }

    return response.json();
  },

  // Delete tariff
  deleteTariff: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/website/v1/tariffs/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete tariff: ${response.statusText}`);
    }
  },

  // Get tariff statistics
  getTariffStats: async (): Promise<TariffStats[]> => {
    const response = await fetch(`${API_BASE}/api/website/v1/stats/tariffs/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tariff stats: ${response.statusText}`);
    }

    return response.json();
  },
};
