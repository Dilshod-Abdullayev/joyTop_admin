import {
  Page,
  PageFilters,
  CreatePageRequest,
  UpdatePageRequest,
  PaginatedPagesResponse,
  PagesApiResponse,
  SinglePageApiResponse,
} from "@/types/pages";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://building.ardentsoft.uz";

export const pagesApi = {
  async getAll(filters: PageFilters = {}): Promise<Page[]> {
    const searchParams = new URLSearchParams();

    if (filters.search) searchParams.append("search", filters.search);
    if (filters.page) searchParams.append("page", filters.page.toString());
    if (filters.page_size)
      searchParams.append("page_size", filters.page_size.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/?${searchParams}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pages");
    }

    const pages: Page[] = await response.json();
    return pages;
  },

  async getBySlug(slug: string): Promise<Page> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/${slug}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const page: Page = await response.json();
    return page;
  },

  async getById(id: number): Promise<Page> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/${id}/`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          lang: localStorage.getItem("i18nextLng") || "ru",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const page: Page = await response.json();
    return page;
  },

  async createPage(data: CreatePageRequest): Promise<Page> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/`,
      {
        method: "POST",
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
      throw new Error(errorData.message || "Failed to create page");
    }

    const page: Page = await response.json();
    return page;
  },

  async updatePage(id: number, data: UpdatePageRequest): Promise<Page> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/${id}/`,
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
      throw new Error(errorData.message || "Failed to update page");
    }

    const page: Page = await response.json();
    return page;
  },

  async patchPage(id: number, data: Partial<UpdatePageRequest>): Promise<Page> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/${id}/`,
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
      throw new Error(errorData.message || "Failed to update page");
    }

    const page: Page = await response.json();
    return page;
  },

  async deletePage(id: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/website/v1/admin/pages/${id}/`,
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
      throw new Error(errorData.message || "Failed to delete page");
    }
  },
};
