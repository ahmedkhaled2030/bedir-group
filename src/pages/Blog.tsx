import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Star,
  Tag,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIModal from "@/components/AIModal";
import { blogApi, formatDate, type BlogPost } from "@/lib/api";

const categories = [
  { key: "all", label: "All" },
  { key: "interior-design", label: "Interior Design" },
  { key: "architecture", label: "Architecture" },
  { key: "renovation", label: "Renovation" },
  { key: "sustainability", label: "Sustainability" },
  { key: "trends", label: "Trends" },
  { key: "tips", label: "Tips & Tricks" },
  { key: "projects", label: "Projects" },
  { key: "news", label: "News" },
];

const Blog = () => {
  const { t, language, dir } = useLanguage();
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogApi.getPosts()
      .then(setAllPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featuredPosts = allPosts.filter((p) => p.featured);

  const filteredPosts = allPosts
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => {
      if (!searchQuery) return true;
      const title = (p.title[language] || p.title.en || "").toLowerCase();
      const excerpt = (p.excerpt[language] || p.excerpt.en || "").toLowerCase();
      return (
        title.includes(searchQuery.toLowerCase()) ||
        excerpt.includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600')",
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block font-body text-xs uppercase tracking-[0.25em] text-gold mb-4">
              {t("blog.subtitle")}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-cream mb-6">
              {t("blog.title")}
            </h1>
            <p className="font-body text-lg text-cream/70 mb-8">
              {t("blog.description")}
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("blog.searchPlaceholder")}
                className="w-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-12 py-4 font-body text-sm text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="sticky top-[72px] z-30 bg-cream/95 backdrop-blur-sm border-b border-charcoal/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-4 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`whitespace-nowrap rounded-full px-5 py-2 font-body text-sm transition-all ${
                  activeCategory === cat.key
                    ? "bg-charcoal text-cream shadow-md"
                    : "bg-white text-charcoal-light hover:bg-charcoal/5 border border-charcoal/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && activeCategory === "all" && !searchQuery && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Star className="h-5 w-5 text-gold" />
              <h2 className="font-display text-2xl text-charcoal">
                {t("blog.featured")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post, i) => (
                <FeaturedCard key={post.id} post={post} language={language} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 && (
            <h2 className="font-display text-2xl text-charcoal mb-8">
              {activeCategory === "all"
                ? t("blog.latestPosts")
                : categories.find((c) => c.key === activeCategory)?.label}
              <span className="font-body text-sm text-charcoal-light ml-3">
                ({filteredPosts.length})
              </span>
            </h2>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white overflow-hidden shadow-sm border border-charcoal/5 animate-pulse">
                  <div className="aspect-[16/10] bg-charcoal/10" />
                  <div className="p-5 space-y-3">
                    <div className="flex gap-3">
                      <div className="h-6 w-24 rounded-full bg-charcoal/10" />
                      <div className="h-6 w-16 rounded-full bg-charcoal/10" />
                    </div>
                    <div className="h-5 w-3/4 rounded bg-charcoal/10" />
                    <div className="h-4 w-full rounded bg-charcoal/5" />
                    <div className="h-4 w-2/3 rounded bg-charcoal/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-charcoal/5 mb-6">
                <Search className="h-8 w-8 text-charcoal-light" />
              </div>
              <h3 className="font-display text-2xl text-charcoal mb-2">
                {t("blog.noPosts")}
              </h3>
              <p className="font-body text-charcoal-light">
                {t("blog.noPostsDescription")}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <BlogCard key={post.id} post={post} language={language} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Featured Blog Card (Large)
const FeaturedCard = ({
  post,
  language,
  index,
}: {
  post: BlogPost;
  language: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Link
      to={`/blog/${post.slug}`}
      className="group block relative overflow-hidden rounded-3xl bg-charcoal aspect-[16/9] shadow-xl"
    >
      {post.cover_image && (
        <img
          src={post.cover_image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="rounded-full bg-gold px-3 py-1 font-body text-xs font-medium text-charcoal">
            {post.category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </span>
          <span className="flex items-center gap-1 font-body text-xs text-cream/70">
            <Clock className="h-3 w-3" />
            {Math.max(1, Math.ceil(JSON.stringify(post.content || {}).length / 1000))} min read
          </span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-cream mb-2 group-hover:text-gold transition-colors">
          {post.title[language] || post.title.en}
        </h3>
        <p className="font-body text-sm text-cream/70 line-clamp-2">
          {post.excerpt[language] || post.excerpt.en}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="flex items-center gap-1 font-body text-xs text-cream/50">
            <Calendar className="h-3 w-3" />
            {formatDate(post.created_at, language)}
          </span>
          <span className="flex items-center gap-1 font-body text-sm text-gold group-hover:gap-2 transition-all">
            Read More <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

// Regular Blog Card
const BlogCard = ({
  post,
  language,
  index,
}: {
  post: BlogPost;
  language: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl bg-white overflow-hidden shadow-sm border border-charcoal/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
    >
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-charcoal/5 to-charcoal/10 flex items-center justify-center">
            <span className="font-display text-4xl text-charcoal/10">B</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="rounded-full bg-charcoal/5 px-3 py-1 font-body text-xs text-charcoal-light">
            {post.category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </span>
          <span className="flex items-center gap-1 font-body text-xs text-charcoal-light">
            <Clock className="h-3 w-3" />
            {Math.max(1, Math.ceil(JSON.stringify(post.content || {}).length / 1000))} min
          </span>
        </div>

        <h3 className="font-display text-lg text-charcoal mb-2 line-clamp-2 group-hover:text-gold transition-colors">
          {post.title[language] || post.title.en}
        </h3>

        <p className="font-body text-sm text-charcoal-light line-clamp-2 mb-4">
          {post.excerpt[language] || post.excerpt.en}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="font-body text-xs font-medium text-gold">
                {(post.author_name || "A").charAt(0)}
              </span>
            </div>
            <span className="font-body text-xs text-charcoal-light">{post.author_name}</span>
          </div>
          <span className="flex items-center gap-1 font-body text-xs text-charcoal-light">
            <Calendar className="h-3 w-3" />
            {formatDate(post.created_at, language)}
          </span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-0.5 rounded-full bg-gold/5 px-2 py-0.5 font-body text-[10px] text-charcoal-light"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  </motion.div>
);

export default Blog;
