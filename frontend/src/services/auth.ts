import api from "./api";
import type { LoginResponse } from "../types/auth";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  profile_image: string | null;
}

export async function login(username: string, password: string) {
  const response = await api.post<LoginResponse>("/auth/login/", {
    username,
    password,
  });

  localStorage.setItem("access_token", response.data.access);
  localStorage.setItem("refresh_token", response.data.refresh);

  return response.data;
}

export async function getProfile() {
  const response = await api.get<UserProfile>("/auth/me/");

  return response.data;
}

export async function updateProfile(
  name: string,
  bio: string,
  profileImage?: File,
) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("bio", bio);

  if (profileImage) {
    formData.append("profile_image", profileImage);
  }

  const response = await api.patch<UserProfile>("/auth/me/", formData);

  return response.data;
}

export async function getFollowing(userId: number) {
  const response = await api.get<UserProfile[]>(`/users/${userId}/following/`);

  return response.data;
}

export async function getFollowers(userId: number) {
  const response = await api.get<UserProfile[]>(`/users/${userId}/followers/`);

  return response.data;
}

export async function followUser(userId: number) {
  const response = await api.post(`/users/${userId}/follow/`);

  return response.data;
}

export async function unfollowUser(userId: number) {
  const response = await api.delete(`/users/${userId}/follow/`);

  return response.data;
}

export async function searchUsers(search: string) {
  const response = await api.get<UserProfile[]>("/users/search/", {
    params: {
      search,
    },
  });

  return response.data;
}
