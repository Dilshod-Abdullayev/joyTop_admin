import {
  District,
  DistrictRequest,
  DistrictUpdateRequest,
  DistrictFilters,
  PaginatedDistrictsResponse,
} from "@/types/districts";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const districtsApi = {
  // Get all districts with optional filters
  getAll: async (
    filters: DistrictFilters = {}
  ): Promise<PaginatedDistrictsResponse> => {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());
    if (filters.ordering) searchParams.append("ordering", filters.ordering);

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/district/?${searchParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to fetch districts`
      );
    }

    const data = await response.json();

    // Handle paginated response structure
    if (data && data.results && Array.isArray(data.results)) {
      return {
        count: data.count || data.results.length,
        next: data.next || null,
        previous: data.previous || null,
        results: data.results,
      };
    } else if (data && data.status === true && Array.isArray(data.data)) {
      // Handle wrapped response structure
      return {
        count: data.data.length,
        next: null,
        previous: null,
        results: data.data,
      };
    } else if (Array.isArray(data)) {
      // Handle simple array response
      return {
        count: data.length,
        next: null,
        previous: null,
        results: data,
      };
    } else {
      console.warn("Unexpected API response structure:", data);
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    }
  },

  // Get district by ID
  getDistrict: async (id: number): Promise<District> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/district/${id}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to fetch district`
      );
    }

    const responseData = await response.json();
    console.log("getDistrict API response:", responseData);

    // Extract district data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the district object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Create new district
  createDistrict: async (data: DistrictRequest): Promise<District> => {
    console.log("Creating district with data:", data);

    const response = await fetch(`${API_BASE_URL}/api/website/v1/district/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        lang: localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("District creation failed:", response.status, errorText);
      throw new Error(`Failed to create district: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("createDistrict API response:", responseData);

    // Extract district data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the district object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Update district (PUT)
  updateDistrict: async (
    id: number,
    data: DistrictRequest
  ): Promise<District> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/district/${id}/`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to update district`
      );
    }

    const responseData = await response.json();
    console.log("updateDistrict API response:", responseData);

    // Extract district data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the district object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Partial update district (PATCH)
  patchDistrict: async (
    id: number,
    data: DistrictUpdateRequest
  ): Promise<District> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/district/${id}/`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to update district`
      );
    }

    const responseData = await response.json();
    console.log("patchDistrict API response:", responseData);

    // Extract district data from the wrapped response
    if (responseData && responseData.status === true && responseData.data) {
      return responseData.data;
    } else if (responseData && responseData.id) {
      // Fallback: if response is already the district object
      return responseData;
    } else {
      console.error("Unexpected API response structure:", responseData);
      throw new Error("Invalid response format from server");
    }
  },

  // Delete district
  deleteDistrict: async (id: number): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/district/${id}/`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to delete district`
      );
    }
  },
};
