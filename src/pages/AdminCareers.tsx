import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Briefcase,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { careersApi, type CareerPost } from "@/lib/api";
import { toast } from "sonner";

const AdminCareers = () => {
  const { t, language } = useLanguage();
  const [careers, setCareers] = useState<CareerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadCareers = async () => {
    try {
      const data = await careersApi.getAllCareers();
      setCareers(data);
    } catch (err) {
      console.error("Failed to load careers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCareers(); }, []);

  const filteredCareers = careers.filter((c) => {
    if (!search) return true;
    const title = (c.title[language] || c.title.en || "").toLowerCase();
    return title.includes(search.toLowerCase());
  });

  const handleDelete = async (id: string) => {
    try {
      await careersApi.deleteCareer(id);
      toast.success("Career listing deleted successfully!", { duration: 3000 });
      await loadCareers();
    } catch (err) {
      console.error("Failed to delete career:", err);
      toast.error("Failed to delete career listing", {
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
            {t("admin.careers")}
          </h1>
          <p className="font-body text-charcoal-light mt-1">
            {t("admin.manageCareers")}
          </p>
        </div>
        <Link
          to="/admin/careers/new"
          className="flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 font-body text-sm font-medium text-cream hover:bg-charcoal/90 transition-colors self-start"
        >
          <Plus className="h-4 w-4" />
          {t("admin.newListing")}
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-light" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.searchCareers")}
          className="w-full max-w-md rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 font-body text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
        />
      </div>

      {/* Listings */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-40 rounded bg-gray-200" />
                  <div className="h-5 w-14 rounded-full bg-gray-100" />
                </div>
                <div className="flex gap-4">
                  <div className="h-3 w-24 rounded bg-gray-100" />
                  <div className="h-3 w-20 rounded bg-gray-100" />
                  <div className="h-3 w-28 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCareers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 rounded-2xl bg-white border border-gray-100"
        >
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-xl text-charcoal mb-2">
            {t("admin.noListingsFound")}
          </h3>
          <p className="font-body text-sm text-charcoal-light mb-6">
            {t("admin.noListingsDescription")}
          </p>
          <Link
            to="/admin/careers/new"
            className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-5 py-2.5 font-body text-sm text-cream hover:bg-charcoal/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("admin.createFirstListing")}
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredCareers.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-charcoal/5 flex-shrink-0">
                <Briefcase className="h-6 w-6 text-charcoal-light" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="font-display text-lg text-charcoal truncate">
                    {career.title[language] || career.title.en || "Untitled"}
                  </h3>
                  <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${
                      career.status === "active"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {career.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 font-body text-sm text-charcoal-light">
                    <MapPin className="h-3 w-3" />
                    {career.location || "—"}
                  </span>
                  <span className="font-body text-sm text-charcoal-light capitalize">
                    {career.job_type.replace("-", " ")}
                  </span>
                  <span className="font-body text-xs text-charcoal-light">
                    {career.department[language] || career.department.en || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  to={`/admin/careers/edit/${career.id}`}
                  className="rounded-lg p-2 text-charcoal-light hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="h-4 w-4" />
                </Link>
                {deleteConfirm === career.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(career.id)}
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
                    onClick={() => setDeleteConfirm(career.id)}
                    className="rounded-lg p-2 text-charcoal-light hover:bg-red-50 hover:text-red-500 transition-colors"
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

export default AdminCareers;
