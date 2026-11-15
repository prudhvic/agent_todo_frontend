export interface UserSignup {
  full_name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
}

export interface AuthToken {
  access_token: string;
  token_type: "bearer";
}