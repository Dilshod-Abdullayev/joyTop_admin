export interface District {
  id: number;
  name: string; // maxLength: 100
}

export interface DistrictRequest {
  name: string; // minLength: 1, maxLength: 100
}

export interface DistrictUpdateRequest {
  name?: string; // minLength: 1, maxLength: 100
}

export interface DistrictFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedDistrictsResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: District[];
}
