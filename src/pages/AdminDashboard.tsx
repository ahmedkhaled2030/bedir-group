import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FileText, Briefcase, Eye, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogApi, careersApi, type BlogPost, type CareerPost } from "@/lib/api";

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [careerPosts, setCareerPosts] = useState<CareerPost[]>([]);

  useEffect(() => {
    blogApi.getAllPosts().then(setBlogPosts).catch(console.error);
    careersApi.getAllCareers().then(setCareerPosts).catch(console.error);
  }, []);

  const publishedPosts = blogPosts.filter((p) => p.status === "published").length;
  const draftPosts = blogPosts.filter((p) => p.status === "draft").length;
  const activeCareers = careerPosts.filter((c) => c.status === "active").length;

  const stats = [
    {
      label: t("admin.totalPosts"),
      value: blogPosts.length,
      icon: FileText,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600",
    },
    {
      label: t("admin.published"),
      value: publishedPosts,
      icon: Eye,
      color: "bg-green-500",
      lightColor: "bg-green-50 text-green-600",
    },
    {
      label: t("admin.drafts"),
      value: draftPosts,
      icon: TrendingUp,
      color: "bg-amber-500",
      lightColor: "bg-amber-50 text-amber-600",
    },
    {
      label: t("admin.activeJobs"),
      value: activeCareers,
      icon: Briefcase,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-charcoal">
          {t("admin.dashboardTitle")}
        </h1>
        <p className="font-body text-charcoal-light mt-1">
          {t("admin.dashboardSubtitle")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-xl p-2.5 ${stat.lightColor}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display text-3xl text-charcoal">{stat.value}</p>
            <p className="font-body text-sm text-charcoal-light mt-1">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-charcoal">
              {t("admin.recentPosts")}
            </h3>
            <Link
              to="/admin/blog/new"
              className="flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 font-body text-xs font-medium text-cream hover:bg-charcoal/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("admin.newPost")}
            </Link>
          </div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-body text-sm text-charcoal-light">
                {t("admin.noPosts")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {blogPosts.slice(0, 5).map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/blog/edit/${post.id}`}
                  className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm font-medium text-charcoal truncate group-hover:text-gold transition-colors">
                      {post.title[language] || post.title.en}
                    </p>
                    <p className="font-body text-xs text-charcoal-light mt-0.5">
                      {new Date(post.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`ml-3 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {post.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Active Career Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg text-charcoal">
              {t("admin.activeListings")}
            </h3>
            <Link
              to="/admin/careers/new"
              className="flex items-center gap-1.5 rounded-lg bg-charcoal px-4 py-2 font-body text-xs font-medium text-cream hover:bg-charcoal/90 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("admin.newListing")}
            </Link>
          </div>

          {careerPosts.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-body text-sm text-charcoal-light">
                {t("admin.noListings")}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {careerPosts.slice(0, 5).map((career) => (
                <Link
                  key={career.id}
                  to={`/admin/careers/edit/${career.id}`}
                  className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm font-medium text-charcoal truncate group-hover:text-gold transition-colors">
                      {career.title[language] || career.title.en}
                    </p>
                    <p className="font-body text-xs text-charcoal-light mt-0.5">
                      {career.location} · {career.job_type}
                    </p>
                  </div>
                  <span
                    className={`ml-3 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${
                      career.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {career.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
