import api from "./api";

export interface FeedPost {
  id: number;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  author: string;
  post: number;
  content: string;
  created_at: string;
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

export async function likePost(postId: number) {
  const response = await api.post(`/posts/${postId}/like/`);

  return response.data;
}

export async function unlikePost(postId: number) {
  const response = await api.delete(`/posts/${postId}/like/`);

  return response.data;
}

export async function getComments(postId: number) {
  const response = await api.get<Comment[]>(`/posts/${postId}/comments/`);

  return response.data;
}

export async function createComment(postId: number, content: string) {
  const response = await api.post<Comment>(`/posts/${postId}/comments/`, {
    content,
  });

  return response.data;
}
