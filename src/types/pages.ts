export interface Page {
  id: number;
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface PageFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreatePageRequest {
  slug: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  content_uz: string;
  content_ru: string;
  content_en: string;
}

export interface UpdatePageRequest {
  slug?: string;
  title_uz?: string;
  title_ru?: string;
  title_en?: string;
  content_uz?: string;
  content_ru?: string;
  content_en?: string;
}

export interface PaginatedPagesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Page[];
}

// API Response wrappers
export interface PagesApiResponse {
  status: boolean;
  message: string;
  data: PaginatedPagesResponse;
}

export interface SinglePageApiResponse {
  status: boolean;
  message: string;
  data: Page;
}
