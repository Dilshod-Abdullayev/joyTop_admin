export interface EskizBalance {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  password: string;
  role: "user";
  status: "active";
  is_vip: boolean;
  balance: number;
}

export interface EskizBalanceResponse {
  status: boolean;
  message: string;
  data: EskizBalance;
}

