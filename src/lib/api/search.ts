export interface SearchResult {
  id: string;
  type: "property" | "user" | "category" | "city" | "tariff";
  title: string;
  subtitle: string;
  icon: string;
  url: string;
}

export interface GlobalSearchParams {
  query: string;
  limit?: number;
  types?: string[];
}

// Base URL for the Building API - you can configure this in your environment
const BUILDING_API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export const searchApi = {
  globalSearch: async (params: GlobalSearchParams): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoints for global search
      const limit = params.limit || 20;
      const [properties, users, categories, cities, tariffs] =
        await Promise.allSettled([
          searchApi.searchProperties(params.query, Math.ceil(limit / 4)), // Increased since categories might be empty
          searchApi.searchUsers(params.query, Math.ceil(limit / 4)),
          searchApi.searchCategories(params.query, Math.ceil(limit / 4)),
          searchApi.searchCities(params.query, Math.ceil(limit / 4)),
          searchApi.searchTariffs(params.query, Math.ceil(limit / 4)),
        ]);

      const allResults: SearchResult[] = [];

      // Log search results for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Search results:", {
          properties:
            properties.status === "fulfilled"
              ? properties.value.length
              : "failed",
          users: users.status === "fulfilled" ? users.value.length : "failed",
          categories:
            categories.status === "fulfilled"
              ? categories.value.length
              : "failed",
          cities:
            cities.status === "fulfilled" ? cities.value.length : "failed",
          tariffs:
            tariffs.status === "fulfilled" ? tariffs.value.length : "failed",
        });
      }

      if (properties.status === "fulfilled")
        allResults.push(...properties.value);
      if (users.status === "fulfilled") allResults.push(...users.value);
      if (categories.status === "fulfilled")
        allResults.push(...categories.value);
      if (cities.status === "fulfilled") allResults.push(...cities.value);
      if (tariffs.status === "fulfilled") allResults.push(...tariffs.value);

      // Sort by relevance (simple implementation - can be enhanced later)
      return allResults
        .sort((a, b) => {
          const aScore = a.title
            .toLowerCase()
            .includes(params.query.toLowerCase())
            ? 2
            : 1;
          const bScore = b.title
            .toLowerCase()
            .includes(params.query.toLowerCase())
            ? 2
            : 1;
          return bScore - aScore;
        })
        .slice(0, limit);
    } catch (error) {
      console.error("Global search API error:", error);
      throw new Error("Failed to perform search");
    }
  },

  // Quick search for specific entity types
  searchProperties: async (
    query: string,
    limit = 10
  ): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoint for properties
      const response = await fetch(
        `${BUILDING_API_BASE}/api/website/v1/listing/?search=${encodeURIComponent(
          query
        )}&page_size=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Property search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const properties = data.data?.results || [];

      return properties.map((property: any) => ({
        id: property.id,
        type: "property" as const,
        title: property.title,
        subtitle: `${property.city_name || ""} ${
          property.location?.district || ""
        }`.trim(),
        icon: "Building2",
        url: `/admin/properties/${property.id}`,
      }));
    } catch (error) {
      console.error("Property search error:", error);
      return [];
    }
  },

  searchUsers: async (query: string, limit = 10): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoint for users
      const response = await fetch(
        `${BUILDING_API_BASE}/api/website/v1/users/?page_size=${limit}`
      );

      if (!response.ok) {
        throw new Error(`User search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const users = data.data?.results || [];

      // Filter users by name or phone (client-side filtering since API doesn't have search)
      const filteredUsers = users
        .filter(
          (user: any) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.phone?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      return filteredUsers.map((user: any) => ({
        id: user.id,
        type: "user" as const,
        title: user.name || user.phone || "Unknown User",
        subtitle: user.phone || "",
        icon: "User",
        url: `/admin/users/${user.id}`,
      }));
    } catch (error) {
      console.error("User search error:", error);
      return [];
    }
  },

  searchCategories: async (
    query: string,
    limit = 10
  ): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoint for categories
      const response = await fetch(
        `${BUILDING_API_BASE}/api/website/v1/category/?page_size=${limit}`
      );

      if (!response.ok) {
        // Categories API has authentication issues, return empty results gracefully
        console.warn(
          "Category search failed - authentication issue on backend"
        );
        return [];
      }

      const data = await response.json();
      const categories = data.data || [];

      // Filter categories by name (client-side filtering since API doesn't have search)
      const filteredCategories = categories
        .filter((category: any) =>
          category.name?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      return filteredCategories.map((category: any) => ({
        id: category.id,
        type: "category" as const,
        title: category.name,
        subtitle: category.is_paid ? "Paid Category" : "Free Category",
        icon: "Tag",
        url: `/admin/categories`,
      }));
    } catch (error) {
      console.error("Category search error:", error);
      // Return empty results instead of throwing error
      return [];
    }
  },

  searchCities: async (query: string, limit = 10): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoint for cities
      const response = await fetch(
        `${BUILDING_API_BASE}/api/website/v1/city/?page_size=${limit}`
      );

      if (!response.ok) {
        throw new Error(`City search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const cities = data.data || [];

      // Filter cities by name (client-side filtering since API doesn't have search)
      const filteredCities = cities
        .filter((city: any) =>
          city.name?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      return filteredCities.map((city: any) => ({
        id: city.id,
        type: "city" as const,
        title: city.name,
        subtitle: "City",
        icon: "MapPin",
        url: `/admin/cities`,
      }));
    } catch (error) {
      console.error("City search error:", error);
      return [];
    }
  },

  searchTariffs: async (query: string, limit = 10): Promise<SearchResult[]> => {
    try {
      // Use the real Building API endpoint for tariffs
      const response = await fetch(
        `${BUILDING_API_BASE}/api/website/v1/tariffs/?page_size=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Tariff search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const tariffs = data.data || [];

      // Filter tariffs by name (client-side filtering since API doesn't have search)
      const filteredTariffs = tariffs
        .filter(
          (tariff: any) =>
            tariff.name?.toLowerCase().includes(query.toLowerCase()) ||
            tariff.description?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      return filteredTariffs.map((tariff: any) => ({
        id: tariff.id,
        type: "tariff" as const,
        title: tariff.name,
        subtitle: `${tariff.duration_days} days`,
        icon: "CreditCard",
        url: `/admin/tariffs`,
      }));
    } catch (error) {
      console.error("Tariff search error:", error);
      return [];
    }
  },
};
