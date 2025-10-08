export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      phone: string;
      photo: string | null;
      bio: string | null;
      role: "owner" | "admin" | "user";
      status: "active" | "banned";
      language: "ru" | "uz" | "en";
      contacts: {
        contact_phone: string | null;
        telegram: string | null;
        whatsapp: string | null;
      };
      balance: number;
      created_at: string;
      updated_at: string;
    };
  };
}

export interface User {
  id: number;
  name: string | null;
  phone: string;
  photo: string | null;
  bio: string | null;
  role: "owner" | "admin" | "user";
  status: "active" | "banned";
  language: "ru" | "uz" | "en";
  contacts: {
    contact_phone: string | null;
    telegram: string | null;
    whatsapp: string | null;
  };
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
