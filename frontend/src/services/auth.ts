import api from "./api";
import type { LoginResponse } from "../types/auth";

export async function login(username: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
}
