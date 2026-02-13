import { v4 as uuidv4 } from "uuid";

// ============ Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  avatar?: string;
}

export interface StoredUser extends User {
  password: string;
}

export interface BlogPost {
  id: string;
  title: Record<string, string>;
  slug: string;
  excerpt: Record<string, string>;
  content: string; // TipTap JSON content
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorAvatar?: string;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: number; // minutes
  featured: boolean;
}

export interface CareerPost {
  id: string;
  title: Record<string, string>;
  department: Record<string, string>;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  description: Record<string, string>;
  requirements: Record<string, string[]>;
  benefits: Record<string, string[]>;
  salary?: string;
  status: "active" | "closed";
  createdAt: string;
  updatedAt: string;
  applicationEmail: string;
}

// ============ Storage Keys ============
const STORAGE_KEYS = {
  USERS: "bedir_users",
  CURRENT_USER: "bedir_current_user",
  BLOG_POSTS: "bedir_blog_posts",
  CAREER_POSTS: "bedir_career_posts",
};

// ============ Generic Storage Helpers ============
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ============ Auth Helpers ============

export function getUsers(): StoredUser[] {
  return getItem<StoredUser[]>(STORAGE_KEYS.USERS, []);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(
  email: string,
  password: string,
  name: string
): User {
  const users = getUsers();
  if (findUserByEmail(email)) {
    throw new Error("Email already registered");
  }

  const newUser: StoredUser = {
    id: uuidv4(),
    email: email.toLowerCase(),
    password,
    name,
    role: users.length === 0 ? "admin" : "user", // First user is admin
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export function authenticateUser(
  email: string,
  password: string
): User | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

// ============ Blog Helpers ============

export function getBlogPosts(): BlogPost[] {
  return getItem<BlogPost[]>(STORAGE_KEYS.BLOG_POSTS, []);
}

export function getPublishedBlogPosts(): BlogPost[] {
  return getBlogPosts()
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}

export function getBlogPostById(id: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.id === id);
}

export function saveBlogPost(post: Partial<BlogPost> & { title: Record<string, string> }): BlogPost {
  const posts = getBlogPosts();
  const now = new Date().toISOString();

  if (post.id) {
    // Update existing
    const index = posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        ...post,
        updatedAt: now,
        publishedAt:
          post.status === "published" && !posts[index].publishedAt
            ? now
            : posts[index].publishedAt,
      };
      setItem(STORAGE_KEYS.BLOG_POSTS, posts);
      return posts[index];
    }
  }

  // Create new
  const slug = generateSlug(post.title.en || post.title.ar || "untitled");
  const newPost: BlogPost = {
    id: uuidv4(),
    title: post.title,
    slug,
    excerpt: post.excerpt || { en: "", ar: "", fr: "", de: "" },
    content: post.content || "",
    coverImage: post.coverImage || "",
    category: post.category || "general",
    tags: post.tags || [],
    author: post.author || "Admin",
    authorAvatar: post.authorAvatar,
    status: post.status || "draft",
    publishedAt: post.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
    readTime: post.readTime || 5,
    featured: post.featured || false,
  };

  posts.push(newPost);
  setItem(STORAGE_KEYS.BLOG_POSTS, posts);
  return newPost;
}

export function deleteBlogPost(id: string): void {
  const posts = getBlogPosts().filter((p) => p.id !== id);
  setItem(STORAGE_KEYS.BLOG_POSTS, posts);
}

// ============ Career Helpers ============

export function getCareerPosts(): CareerPost[] {
  return getItem<CareerPost[]>(STORAGE_KEYS.CAREER_POSTS, []);
}

export function getActiveCareerPosts(): CareerPost[] {
  return getCareerPosts().filter((c) => c.status === "active");
}

export function getCareerPostById(id: string): CareerPost | undefined {
  return getCareerPosts().find((c) => c.id === id);
}

export function saveCareerPost(
  post: Partial<CareerPost> & { title: Record<string, string> }
): CareerPost {
  const posts = getCareerPosts();
  const now = new Date().toISOString();

  if (post.id) {
    const index = posts.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...post, updatedAt: now };
      setItem(STORAGE_KEYS.CAREER_POSTS, posts);
      return posts[index];
    }
  }

  const newPost: CareerPost = {
    id: uuidv4(),
    title: post.title,
    department: post.department || { en: "", ar: "", fr: "", de: "" },
    location: post.location || "",
    type: post.type || "full-time",
    description: post.description || { en: "", ar: "", fr: "", de: "" },
    requirements: post.requirements || { en: [], ar: [], fr: [], de: [] },
    benefits: post.benefits || { en: [], ar: [], fr: [], de: [] },
    salary: post.salary,
    status: post.status || "active",
    createdAt: now,
    updatedAt: now,
    applicationEmail: post.applicationEmail || "careers@bedirgroup.com",
  };

  posts.push(newPost);
  setItem(STORAGE_KEYS.CAREER_POSTS, posts);
  return newPost;
}

export function deleteCareerPost(id: string): void {
  const posts = getCareerPosts().filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.CAREER_POSTS, posts);
}

// ============ Utility ============

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .substring(0, 60);
}

export function formatDate(dateString: string, lang: string = "en"): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    en: "en-GB",
    ar: "ar-EG",
    fr: "fr-FR",
    de: "de-DE",
  };
  return date.toLocaleDateString(localeMap[lang] || "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
