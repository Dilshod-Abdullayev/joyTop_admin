import { City, CityRequest, CityUpdateRequest } from "@/types/cities";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const citiesApi = {
  async getAll(): Promise<City[]> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to fetch cities`
      );
    }

    const data = await response.json();
    return data.data;
  },

  async getById(id: number): Promise<City> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/${id}/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to fetch city`
      );
    }

    const data = await response.json();
    return data;
  },

  async create(data: CityRequest): Promise<City> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to create city`
      );
    }

    const result = await response.json();
    return result;
  },

  async update(id: number, data: CityRequest): Promise<City> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/${id}/`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update city`
      );
    }

    const result = await response.json();
    return result;
  },

  async partialUpdate(id: number, data: CityUpdateRequest): Promise<City> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/${id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to update city`
      );
    }

    const result = await response.json();
    return result;
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/website/v1/city/${id}/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "lang": localStorage.getItem("i18nextLng") || "ru",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: Failed to delete city`
      );
    }
  },

  async getWithCount(): Promise<City[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/city/with-count/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to fetch cities with count`
      );
    }

    const data = await response.json();
    return data;
  },

  async getLocation(): Promise<City[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/city/location/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "lang": localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `HTTP ${response.status}: Failed to fetch city locations`
      );
    }

    const data = await response.json();
    return data;
  },
};
