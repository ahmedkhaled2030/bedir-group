import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  MoreVertical,
  FileText,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogApi, type BlogPost } from "@/lib/api";
import { toast } from "sonner";

const AdminBlog = () => {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const data = await blogApi.getAllPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredPosts = posts
    .filter((post) => {
      if (filter === "published") return post.status === "published";
      if (filter === "draft") return post.status === "draft";
      return true;
    })
    .filter((post) => {
      if (!search) return true;
      const title = (post.title[language] || post.title.en || "").toLowerCase();
      return title.includes(search.toLowerCase());
    })
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

  const handleDelete = async (id: string) => {
    try {
      await blogApi.deletePost(id);
      toast.success("Post deleted successfully!", { duration: 3000 });
      await loadPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete post", {
        description: (err as Error).message,
        duration: 5000,
      });
    }
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-charcoal">
            {t("admin.blogPosts")}
          </h1>
          <p className="font-body text-charcoal-light mt-1">
            {t("admin.manageBlog")}
          </p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 font-body text-sm font-medium text-cream hover:bg-charcoal/90 transition-colors self-start"
        >
          <Plus className="h-4 w-4" />
          {t("admin.newPost")}
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.searchPosts")}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex rounded-xl border border-gray-200 bg-white p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 font-body text-xs font-medium transition-all ${
                filter === f
                  ? "bg-charcoal text-cream"
                  : "text-charcoal-light hover:text-charcoal"
              }`}
            >
              {t(`admin.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="hidden sm:block h-20 w-28 flex-shrink-0 rounded-xl bg-gray-200" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-48 rounded bg-gray-200" />
                  <div className="h-5 w-16 rounded-full bg-gray-100" />
                </div>
                <div className="h-4 w-3/4 rounded bg-gray-100" />
                <div className="flex gap-4">
                  <div className="h-3 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl bg-white border border-gray-100"
        >
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl text-charcoal mb-2">
            {t("admin.noPostsFound")}
          </h3>
          <p className="font-body text-sm text-charcoal-light mb-6">
            {t("admin.noPostsDescription")}
          </p>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 font-body text-sm text-cream hover:bg-charcoal/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("admin.createFirstPost")}
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              {/* Cover Image */}
              {post.cover_image ? (
                <div className="hidden sm:block h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={post.cover_image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="hidden sm:flex h-20 w-28 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <FileText className="h-8 w-8 text-gray-300" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-display text-lg text-charcoal truncate">
                    {post.title[language] || post.title.en || "Untitled"}
                  </h3>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="font-body text-sm text-charcoal-light mt-1 truncate">
                  {post.excerpt[language] || post.excerpt.en || "No excerpt"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 font-body text-xs text-charcoal-light">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.updated_at).toLocaleDateString("en-GB")}
                  </span>
                  <span className="font-body text-xs text-charcoal-light capitalize">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {post.status === "published" && (
                  <Link
                    to={`/blog/${post.slug}`}
                    className="rounded-lg p-2 text-charcoal-light hover:bg-gray-100 hover:text-charcoal transition-colors"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                )}
                <Link
                  to={`/admin/blog/edit/${post.id}`}
                  className="rounded-lg p-2 text-charcoal-light hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                {deleteConfirm === post.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="rounded-lg px-3 py-1.5 bg-red-500 text-white font-body text-xs hover:bg-red-600 transition-colors"
                    >
                      {t("admin.confirmDelete")}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded-lg px-3 py-1.5 bg-gray-100 text-charcoal font-body text-xs hover:bg-gray-200 transition-colors"
                    >
                      {t("admin.cancel")}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="rounded-lg p-2 text-charcoal-light hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
