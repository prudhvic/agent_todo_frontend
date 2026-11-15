
import { apiClient } from "@/lib/api/client";
import type {
  UserSignup,
  UserLogin,
  User,
  AuthToken,
} from "../types/auth.types";

export const signup = async (
  payload: UserSignup
): Promise<User> => {
  const { data } = await apiClient.post<User>(
    "/auth/signup",
    payload
  );

  return data;
};

export const login = async (
  payload: UserLogin
): Promise<AuthToken> => {
  const { data } = await apiClient.post<AuthToken>(
    "/auth/login",
    payload
  );

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
  }

  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>("/auth/me");

  return data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }
};