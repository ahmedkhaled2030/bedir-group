import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  ImageIcon,
  Tag,
  Globe,
  Star,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import RichTextEditor from "@/components/RichTextEditor";
import {
  blogApi,
  uploadImage,
  type BlogPost,
} from "@/lib/api";
import { toast } from "sonner";

const categories = [
  "interior-design",
  "architecture",
  "renovation",
  "sustainability",
  "trends",
  "tips",
  "projects",
  "news",
];

type LangKey = "en" | "ar" | "fr" | "de";
const languages: { code: LangKey; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

const AdminBlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState<LangKey>("en");
  const [title, setTitle] = useState<Record<string, string>>({
    en: "",
    ar: "",
    fr: "",
    de: "",
  });
  const [excerpt, setExcerpt] = useState<Record<string, string>>({
    en: "",
    ar: "",
    fr: "",
    de: "",
  });
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("interior-design");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      blogApi.getPostById(id).then((post) => {
        setTitle(post.title);
        setExcerpt(post.excerpt);
        setContent(post.content ? JSON.stringify(post.content) : "");
        setCoverImage(post.cover_image);
        setCategory(post.category);
        setTags(post.tags);
        setFeatured(post.featured);
        setStatus(post.status);
      }).catch(() => navigate("/admin/blog"));
    }
  }, [id, isEditing, navigate]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading("Uploading image...");
      const url = await uploadImage(file);
      setCoverImage(url);
      toast.dismiss();
      toast.success("Cover image uploaded!", { duration: 2000 });
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to upload cover image", {
        description: (err as Error).message,
        duration: 5000,
      });
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async (saveStatus: "draft" | "published") => {
    setIsSaving(true);
    try {
      let contentObj: Record<string, unknown> | null = null;
      try {
        contentObj = JSON.parse(content);
      } catch {
        contentObj = null;
      }

      const payload = {
        title: title as BlogPost["title"],
        excerpt: excerpt as BlogPost["excerpt"],
        content: contentObj,
        cover_image: coverImage,
        category,
        tags,
        status: saveStatus,
        featured,
      };

      if (isEditing && id) {
        await blogApi.updatePost(id, payload);
        toast.success("Post updated successfully!", { duration: 3000 });
      } else {
        await blogApi.createPost(payload);
        toast.success("Post created successfully!", { duration: 3000 });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      setTimeout(() => navigate("/admin/blog"), 500);
    } catch (err) {
      console.error("Failed to save post:", err);
      toast.error("Failed to save post", {
        description: (err as Error).message,
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/blog")}
            className="rounded-xl p-2 text-charcoal-light hover:bg-gray-100 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl text-charcoal">
              {isEditing ? t("admin.editPost") : t("admin.newPost")}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="font-body text-sm text-green-600"
            >
              {t("admin.saved")} ✓
            </motion.span>
          )}
          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 font-body text-sm text-charcoal hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {t("admin.saveDraft")}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-charcoal px-4 py-2 font-body text-sm font-medium text-cream hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            {t("admin.publish")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language Tabs for Title/Excerpt */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1 mb-4 border-b border-gray-100 pb-3">
              <Globe className="h-4 w-4 text-charcoal-light mr-2" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveTab(lang.code)}
                  className={`rounded-lg px-3 py-1.5 font-body text-xs font-medium transition-all ${
                    activeTab === lang.code
                      ? "bg-charcoal text-cream"
                      : "text-charcoal-light hover:bg-gray-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.postTitle")} ({activeTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={title[activeTab] || ""}
                onChange={(e) =>
                  setTitle({ ...title, [activeTab]: e.target.value })
                }
                placeholder={`Enter title in ${
                  languages.find((l) => l.code === activeTab)?.label
                }...`}
                dir={activeTab === "ar" ? "rtl" : "ltr"}
                className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-display text-xl text-charcoal placeholder:text-charcoal-light/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 ${
                  activeTab === "ar" ? "font-arabic" : ""
                }`}
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="font-body text-sm font-medium text-charcoal mb-1.5 block">
                {t("admin.postExcerpt")} ({activeTab.toUpperCase()})
              </label>
              <textarea
                value={excerpt[activeTab] || ""}
                onChange={(e) =>
                  setExcerpt({ ...excerpt, [activeTab]: e.target.value })
                }
                placeholder={`Write a brief summary...`}
                rows={3}
                dir={activeTab === "ar" ? "rtl" : "ltr"}
                className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-body text-sm text-charcoal placeholder:text-charcoal-light/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none ${
                  activeTab === "ar" ? "font-arabic" : ""
                }`}
              />
            </div>
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="font-body text-sm font-medium text-charcoal mb-2 block flex items-center gap-2">
              {t("admin.postContent")}
              <span className="text-xs text-charcoal-light font-normal">
                (supports images, formatting, links)
              </span>
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog post... Use the toolbar above for formatting, or select text for a quick menu."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-display text-base text-charcoal mb-3 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {t("admin.coverImage")}
            </h3>
            {coverImage ? (
              <div className="relative group">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity">
                  <label className="cursor-pointer rounded-lg bg-white px-4 py-2 font-body text-xs font-medium text-charcoal hover:bg-gray-100 transition-colors">
                    {t("admin.changeCover")}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all">
                <ImageIcon className="h-8 w-8 text-gray-300 mb-2" />
                <span className="font-body text-xs text-charcoal-light">
                  {t("admin.uploadCover")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-display text-base text-charcoal mb-3">
              {t("admin.category")}
            </h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-body text-sm text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <h3 className="font-display text-base text-charcoal mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {t("admin.tags")}
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-body text-xs text-charcoal focus:border-gold focus:outline-none"
              />
              <button
                onClick={handleAddTag}
                className="rounded-lg bg-gray-100 px-3 py-2 font-body text-xs text-charcoal hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 font-body text-xs text-charcoal"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-charcoal-light hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  featured ? "bg-gold" : "bg-gray-200"
                }`}
                onClick={() => setFeatured(!featured)}
              >
                <div
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    featured ? "translate-x-5" : ""
                  }`}
                />
              </div>
              <div className="flex items-center gap-2">
                <Star className={`h-4 w-4 ${featured ? "text-gold" : "text-gray-300"}`} />
                <span className="font-body text-sm text-charcoal">
                  {t("admin.featuredPost")}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
