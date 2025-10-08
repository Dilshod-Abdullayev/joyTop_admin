export interface Banner {
  id: number;
  title: string;
  image: string; // URL format
  link?: string; // URL format, nullable
  end_date?: string; // Date format, nullable
}

export interface BannerRequest {
  title: string; // minLength: 1, maxLength: 255
  image: File | string; // binary format for upload
  link?: string; // URL format, nullable, maxLength: 200
  end_date?: string; // Date format, nullable
}

export interface BannerUpdateRequest {
  title?: string; // minLength: 1, maxLength: 255
  image?: File | string; // binary format for upload
  link?: string; // URL format, nullable, maxLength: 200
  end_date?: string; // Date format, nullable
}

export interface BannerFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedBannersResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Banner[];
}
