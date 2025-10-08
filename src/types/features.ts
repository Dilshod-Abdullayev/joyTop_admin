export interface Feature {
  id: number;
  name: string; // readOnly: true
}

export interface FeatureFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedFeaturesResponse {
  count: number;
  next?: string;
  previous?: string;
  results: Feature[];
}

// Note: Features are read-only in the API
// The name field is marked as readOnly: true
// No create/update/delete operations are supported
export interface FeatureRequest {
  // This interface exists for completeness but features cannot be created via API
  name: string;
}

export interface FeatureUpdateRequest {
  // This interface exists for completeness but features cannot be updated via API
  name?: string;
}
