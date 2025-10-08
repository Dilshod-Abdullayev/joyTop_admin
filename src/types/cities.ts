export interface City {
  id: number;
  name: string;
}

export interface CityRequest {
  name: string;
}

export interface CityUpdateRequest {
  name?: string;
}

export interface CitiesResponse {
  data: City[];
}

export interface CityResponse {
  data: City;
}


