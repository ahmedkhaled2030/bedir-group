import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Tag,
  Share2,
  Heart,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TipTapLink from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIModal from "@/components/AIModal";
import {
  blogApi,
  formatDate,
  type BlogPost,
} from "@/lib/api";

const extensions = [
  StarterKit,
  Image.configure({
    HTMLAttributes: { class: "rounded-xl max-w-full mx-auto my-6 shadow-md" },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Underline,
  TipTapLink.configure({
    HTMLAttributes: { class: "text-gold underline" },
  }),
  Highlight.configure({
    HTMLAttributes: { class: "bg-gold/30 px-1 rounded" },
  }),
  TextStyle,
  Color,
];

const BlogPostPage = () => {
  const { slug } = useParams();
  const { t, language, dir } = useLanguage();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    blogApi.getPostBySlug(slug)
      .then((p) => {
        setPost(p);
        return blogApi.getPosts({ category: p.category });
      })
      .then((all) => {
        setRelatedPosts(all.filter((p) => p.slug !== slug).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream" dir={dir}>
        <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />
        <section className="relative pt-24 bg-charcoal overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
          <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center animate-pulse space-y-6">
              <div className="h-4 w-32 mx-auto rounded bg-cream/20" />
              <div className="flex items-center justify-center gap-3">
                <div className="h-6 w-24 rounded-full bg-cream/15" />
                <div className="h-4 w-20 rounded bg-cream/10" />
              </div>
              <div className="h-10 w-3/4 mx-auto rounded bg-cream/20" />
              <div className="h-10 w-1/2 mx-auto rounded bg-cream/15" />
              <div className="h-4 w-40 mx-auto rounded bg-cream/10" />
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12 max-w-3xl animate-pulse space-y-4">
          <div className="h-4 w-full rounded bg-charcoal/10" />
          <div className="h-4 w-5/6 rounded bg-charcoal/10" />
          <div className="h-4 w-4/6 rounded bg-charcoal/5" />
          <div className="h-40 w-full rounded-xl bg-charcoal/5 mt-6" />
          <div className="h-4 w-full rounded bg-charcoal/10 mt-6" />
          <div className="h-4 w-3/4 rounded bg-charcoal/10" />
          <div className="h-4 w-5/6 rounded bg-charcoal/5" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <h1 className="font-display text-4xl text-charcoal mb-4">
            {t("blog.postNotFound")}
          </h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-body text-gold hover:text-gold-dark transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("blog.backToBlog")}
          </Link>
        </div>
      </div>
    );
  }

  // Render TipTap content to HTML
  let htmlContent = "";
  try {
    const contentJSON = typeof post.content === "string" ? JSON.parse(post.content) : post.content;
    htmlContent = generateHTML(contentJSON, extensions);
  } catch {
    htmlContent = "<p>No content available.</p>";
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title[language] || post.title.en,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-cream" dir={dir}>
      <Navbar onOpenAIModal={() => setIsAIModalOpen(true)} />
      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Hero / Cover */}
      <section className="relative pt-24 bg-charcoal overflow-hidden">
        {post.cover_image ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.cover_image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal-light" />
        )}

        <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Back */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-sm text-cream/70 hover:text-cream mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("blog.backToBlog")}
            </Link>

            {/* Category & Meta */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rounded-full bg-gold px-4 py-1 font-body text-xs font-medium text-charcoal">
                {post.category
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </span>
              <span className="flex items-center gap-1 font-body text-xs text-cream/60">
                <Clock className="h-3 w-3" />
                {Math.max(1, Math.ceil(JSON.stringify(post.content || {}).length / 1000))} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-cream mb-6 leading-tight">
              {post.title[language] || post.title.en}
            </h1>

            {/* Author & Date */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gold/30 flex items-center justify-center">
                  <span className="font-body text-sm font-medium text-cream">
                    {(post.author_name || "A").charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="font-body text-sm font-medium text-cream">
                    {post.author_name}
                  </p>
                  <p className="flex items-center gap-1 font-body text-xs text-cream/50">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.created_at, language)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {/* Excerpt */}
            {(post.excerpt[language] || post.excerpt.en) && (
              <p className="font-body text-xl text-charcoal-light leading-relaxed mb-8 italic border-l-4 border-gold pl-6">
                {post.excerpt[language] || post.excerpt.en}
              </p>
            )}

            {/* Content */}
            <div
              className="prose prose-lg max-w-none font-body text-charcoal
                prose-headings:font-display prose-headings:text-charcoal
                prose-p:text-charcoal/80 prose-p:leading-relaxed
                prose-a:text-gold prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-gold prose-blockquote:bg-gold/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-strong:text-charcoal
                prose-code:bg-charcoal/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-sm
                prose-pre:bg-charcoal prose-pre:text-cream prose-pre:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-charcoal/10">
                <Tag className="h-4 w-4 text-charcoal-light" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-charcoal/5 px-4 py-1.5 font-body text-xs text-charcoal-light"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-body text-sm transition-all ${
                  liked
                    ? "bg-red-50 text-red-500 border border-red-200"
                    : "bg-white text-charcoal-light border border-charcoal/10 hover:border-charcoal/20"
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                {liked ? t("blog.liked") : t("blog.like")}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 font-body text-sm text-charcoal-light border border-charcoal/10 hover:border-charcoal/20 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                {t("blog.share")}
              </button>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl text-charcoal mb-8 text-center">
              {t("blog.relatedPosts")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  to={`/blog/${rPost.slug}`}
                  className="group rounded-2xl overflow-hidden bg-cream border border-charcoal/5 hover:shadow-lg transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {rPost.cover_image ? (
                      <img
                        src={rPost.cover_image}
                        alt=""
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full bg-charcoal/5 flex items-center justify-center">
                        <span className="font-display text-3xl text-charcoal/10">B</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-display text-base text-charcoal line-clamp-2 group-hover:text-gold transition-colors">
                      {rPost.title[language] || rPost.title.en}
                    </h4>
                    <p className="font-body text-xs text-charcoal-light mt-1">
                      {formatDate(rPost.created_at, language)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;
