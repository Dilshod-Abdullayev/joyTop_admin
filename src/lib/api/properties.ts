import {
  PropertyFilters,
  PaginatedPropertiesResponse,
} from "@/types/properties";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const propertiesApi = {
  async getProperties(
    filters: PropertyFilters = {}
  ): Promise<PaginatedPropertiesResponse> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.category)
      searchParams.append("category", filters.category.toString());
    if (filters.city) searchParams.append("city", filters.city.toString());
    if (filters.transaction_type)
      searchParams.append("transaction_type", filters.transaction_type);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/listing/?${searchParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async getProperty(id: number): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/listing/${id}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch property");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async createProperty(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/listing/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create property");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async updateProperty(id: number, data: any): Promise<any> {
    console.log("API updateProperty called with:", data);
    console.log("Data type:", typeof data);
    console.log("Is object:", data instanceof Object);

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/listing/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update property");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async deleteProperty(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/listing/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete property");
    }
  },

  async togglePropertyStatus(id: number, status: boolean): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/listing/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to toggle property status");
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  },
};
