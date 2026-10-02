import api from "./api";

export interface FeedPost {
  id: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getFeed() {
  const response = await api.get<FeedPost[]>("/feed/");

  return response.data;
}

export async function createPost(content: string) {
  const response = await api.post<FeedPost>("/posts/", {
    content,
  });

  return response.data;
}
