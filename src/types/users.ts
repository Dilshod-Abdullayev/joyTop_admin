export interface User {
  id: number;
  name: string;
  phone: string;
  photo: string | null;
  bio: string;
  role: string;
  status: string;
  language: string;
  contacts: {
    contact_phone: string;
    telegram: string;
    whatsapp: string;
  };
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  language?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface PaginatedUsersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
