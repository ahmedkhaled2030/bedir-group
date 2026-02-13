const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Token management ─────────────────────────────────────

const TOKEN_KEY = "bedir_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Fetch wrapper ────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (err) {
    // Network error / connection refused
    throw new Error(
      "Unable to connect to the server. Please make sure the backend is running and try again."
    );
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `Server error (${res.status})`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

// ─── Upload helper ────────────────────────────────────────

export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/blog/upload-image`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please make sure the backend is running."
    );
  }

  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return `${API_BASE}${data.url}`;
}

// ─── Auth API ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getProfile: () => apiFetch<User>("/api/auth/profile"),
};

// ─── Blog API ─────────────────────────────────────────────

export interface LocalizedText {
  en: string;
  ar: string;
  fr: string;
  de: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: Record<string, unknown> | null;
  cover_image: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  slug: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export type BlogPostInput = Omit<BlogPost, "id" | "slug" | "author_id" | "author_name" | "created_at" | "updated_at">;

export const blogApi = {
  // Public
  getPosts: (params?: { category?: string; search?: string; page?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", String(params.page));
    return apiFetch<BlogPost[]>(`/api/blog/posts?${query}`);
  },

  getPostBySlug: (slug: string) =>
    apiFetch<BlogPost>(`/api/blog/posts/${slug}`),

  // Admin
  getAllPosts: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    return apiFetch<BlogPost[]>(`/api/blog/admin/posts?${query}`);
  },

  getPostById: (id: string) =>
    apiFetch<BlogPost>(`/api/blog/admin/posts/${id}`),

  createPost: (data: BlogPostInput) =>
    apiFetch<BlogPost>("/api/blog/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePost: (id: string, data: BlogPostInput) =>
    apiFetch<BlogPost>(`/api/blog/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletePost: (id: string) =>
    apiFetch<void>(`/api/blog/admin/posts/${id}`, { method: "DELETE" }),
};

// ─── Careers API ──────────────────────────────────────────

export interface CareerPost {
  id: string;
  title: LocalizedText;
  department: LocalizedText;
  description: LocalizedText;
  requirements: Record<string, string[]>;
  benefits: Record<string, string[]>;
  location: string;
  job_type: string;
  salary: string;
  application_email: string;
  status: "active" | "closed";
  created_at: string;
  updated_at: string;
}

export type CareerPostInput = Omit<CareerPost, "id" | "created_at" | "updated_at">;

export const careersApi = {
  // Public
  getActiveCareers: (params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    return apiFetch<CareerPost[]>(`/api/careers/posts?${query}`);
  },

  // Admin
  getAllCareers: (params?: { search?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    return apiFetch<CareerPost[]>(`/api/careers/admin/posts?${query}`);
  },

  getCareerById: (id: string) =>
    apiFetch<CareerPost>(`/api/careers/admin/posts/${id}`),

  createCareer: (data: CareerPostInput) =>
    apiFetch<CareerPost>("/api/careers/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateCareer: (id: string, data: CareerPostInput) =>
    apiFetch<CareerPost>(`/api/careers/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteCareer: (id: string) =>
    apiFetch<void>(`/api/careers/admin/posts/${id}`, { method: "DELETE" }),
};

// ─── Helpers ──────────────────────────────────────────────

export function formatDate(dateStr: string, locale: string = "en"): string {
  const date = new Date(dateStr);
  const localeMap: Record<string, string> = {
    en: "en-US",
    ar: "ar-EG",
    fr: "fr-FR",
    de: "de-DE",
  };
  return date.toLocaleDateString(localeMap[locale] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
